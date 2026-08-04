#!/usr/bin/env python3
"""Copy attachments referenced by the markdown files in Quartz's content/
folder from the Obsidian vault.

Handles both Obsidian-style embeds/links and standard markdown links:

    ![[Pasted image 2024.png]]          (wiki embed)
    ![[Pasted image 2024.png|300]]      (wiki embed with options)
    [[document.pdf]]                    (wiki link to an attachment)
    ![alt text](Attachments/img.png)    (markdown image)
    [label](Attachments/document.pdf)   (markdown link to an attachment)

Files are copied into content/ preserving their path relative to the vault
root (e.g. Attachments/foo.png -> content/Attachments/foo.png) so existing
links keep working.

Usage:
    ./scripts/copy_attachments.py [--vault PATH] [--content PATH] [--dry-run]
"""

import argparse
import re
import shutil
import sys
from pathlib import Path
from urllib.parse import unquote

# Extensions treated as attachments (everything else is assumed to be a note).
ATTACHMENT_EXTS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".ico",
    ".avif", ".tiff", ".heic",
    ".pdf", ".zip", ".gz", ".tar", ".7z", ".rar",
    ".mp3", ".mp4", ".mov", ".wav", ".ogg", ".webm", ".m4a", ".flac",
    ".excalidraw", ".canvas",
}

# Directories to ignore when indexing the vault.
IGNORED_DIRS = {".git", ".obsidian", ".trash", ".smart-env", ".claude", "node_modules"}

# --- Reference patterns ------------------------------------------------------

FENCED_CODE_RE = re.compile(r"```.*?```|~~~.*?~~~", re.DOTALL)
WIKI_RE = re.compile(r"(!?)\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]")
MD_RE = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")


def strip_code_blocks(text: str) -> str:
    """Remove fenced code blocks so examples inside them are not matched."""
    return FENCED_CODE_RE.sub("", text)


def find_references(md_file: Path) -> list[str]:
    """Return all attachment targets referenced by a markdown file."""
    text = strip_code_blocks(md_file.read_text(encoding="utf-8"))
    refs: list[str] = []

    for _is_embed, target in WIKI_RE.findall(text):
        target = target.strip()
        # Only attachments: embeds of notes (no extension) are transclusions.
        if Path(target).suffix.lower() in ATTACHMENT_EXTS:
            refs.append(target)

    for raw_target in MD_RE.findall(text):
        target = unquote(raw_target.strip().strip("<>")).split("#")[0].strip()
        if not target or "://" in target or target.startswith("mailto:"):
            continue
        if Path(target).suffix.lower() in ATTACHMENT_EXTS:
            refs.append(target)

    return refs


def index_vault(vault: Path) -> tuple[dict[str, Path], list[Path]]:
    """Index vault files by basename; also keep the full list for path matching."""
    by_name: dict[str, Path] = {}
    all_files: list[Path] = []
    for path in vault.rglob("*"):
        if not path.is_file():
            continue
        if any(part in IGNORED_DIRS for part in path.relative_to(vault).parts):
            continue
        all_files.append(path)
        by_name.setdefault(path.name, path)  # first match wins
    return by_name, all_files


def resolve(ref: str, vault: Path, by_name: dict[str, Path],
            all_files: list[Path]) -> Path | None:
    """Resolve an attachment reference to a file inside the vault."""
    ref_path = Path(ref)

    # 1. Reference contains a path -> match by vault-relative path (or suffix).
    if len(ref_path.parts) > 1:
        candidate = vault / ref
        if candidate.is_file():
            return candidate
        for path in all_files:
            rel = path.relative_to(vault)
            if str(rel).endswith(ref) or rel.parts[-len(ref_path.parts):] == ref_path.parts:
                return path
        return None

    # 2. Bare filename -> match by basename.
    return by_name.get(ref)


def main() -> int:
    repo_root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--vault", type=Path, default=Path.home() / "Documents/obsidian",
                        help="Path to the Obsidian vault (default: ~/Documents/obsidian)")
    parser.add_argument("--content", type=Path, default=repo_root / "content",
                        help="Path to Quartz's content folder (default: <repo>/content)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show what would be copied without copying")
    args = parser.parse_args()

    vault: Path = args.vault.expanduser().resolve()
    content: Path = args.content.expanduser().resolve()

    if not vault.is_dir():
        sys.exit(f"error: vault not found: {vault}")
    if not content.is_dir():
        sys.exit(f"error: content folder not found: {content}")

    md_files = sorted(content.rglob("*.md"))
    print(f"Scanning {len(md_files)} markdown file(s) in {content}")

    by_name, all_files = index_vault(vault)

    copied, up_to_date, missing = 0, 0, []
    seen: set[Path] = set()

    for md_file in md_files:
        for ref in find_references(md_file):
            src = resolve(ref, vault, by_name, all_files)
            if src is None:
                missing.append((md_file.name, ref))
                continue
            if src in seen:
                continue
            seen.add(src)

            dest = content / src.relative_to(vault)
            if dest.exists() and dest.read_bytes() == src.read_bytes():
                up_to_date += 1
                continue

            print(f"{'[dry-run] ' if args.dry_run else ''}copy: {src} -> {dest}")
            if not args.dry_run:
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dest)
            copied += 1

    print(f"\n{copied} copied, {up_to_date} already up to date, {len(missing)} missing")
    for md_name, ref in missing:
        print(f"  WARNING: '{ref}' referenced in '{md_name}' not found in vault", file=sys.stderr)

    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())

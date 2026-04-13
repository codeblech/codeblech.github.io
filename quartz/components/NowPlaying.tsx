import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface NowPlayingOptions {
  username: string
  apiKey: string
  useLibreFm?: boolean
  emptyMessage?: string
  errorMessage?: string
}

const defaultOptions = {
  useLibreFm: false,
  emptyMessage: "Nothing playing lately",
  errorMessage: "Could not load track",
} satisfies Partial<NowPlayingOptions>

export default ((userOpts: NowPlayingOptions) => {
  const opts = { ...defaultOptions, ...userOpts }
  const baseUrl = opts.useLibreFm ? "https://libre.fm/2.0/" : "https://ws.audioscrobbler.com/2.0/"

  const NowPlaying: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <section class={classNames(displayClass, "now-playing-widget")} data-now-playing-widget>
        <div class="np-glow np-glow-one" aria-hidden="true"></div>
        <div class="np-glow np-glow-two" aria-hidden="true"></div>
        <div class="np-cover-shell">
          <img
            class="np-cover"
            data-now-playing-cover
            src=""
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div class="np-cover-fallback" data-now-playing-fallback aria-hidden="true">
            ♫
          </div>
        </div>
        <div class="np-body">
          <div class="np-topline">
            <span class="np-kicker" data-now-playing-kicker>
              Spinning up
            </span>
            <span class="np-status" data-now-playing-status>
              Fetching
            </span>
          </div>
          <a
            class="np-track-link"
            data-now-playing-link
            href={baseUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="np-title" data-now-playing-title>
              Loading...
            </span>
          </a>
          <p class="np-meta" data-now-playing-meta>
            Pulling your latest scrobble.
          </p>
          <div class="np-wave-wrap" aria-hidden="true">
            <svg class="np-wave" viewBox="0 0 220 32" preserveAspectRatio="none">
              <path
                class="np-wave-back"
                d="M0 16 C12 4, 24 4, 36 16 S60 28, 72 16 S96 4, 108 16 S132 28, 144 16 S168 4, 180 16 S204 28, 220 16"
              />
              <path
                class="np-wave-front"
                d="M0 16 C12 4, 24 4, 36 16 S60 28, 72 16 S96 4, 108 16 S132 28, 144 16 S168 4, 180 16 S204 28, 220 16"
              />
            </svg>
            <span class="np-live" data-now-playing-live hidden></span>
          </div>
          <p class="np-album" data-now-playing-album>
            Waiting for cover art.
          </p>
        </div>
      </section>
    )
  }

  NowPlaying.css = `
    .now-playing-widget {
      --np-cyan: #4fd1c5;
      --np-coral: #ff8a5b;
      --np-gold: #f6d365;
      --np-ink: rgba(14, 23, 38, 0.92);
      position: relative;
      display: grid;
      grid-template-columns: 88px minmax(0, 1fr);
      gap: 1rem;
      align-items: center;
      overflow: hidden;
      margin-top: 1.1rem;
      padding: 1rem;
      border: 1px solid color-mix(in srgb, var(--secondary) 16%, white 84%);
      border-radius: 1.35rem;
      background:
        linear-gradient(140deg, rgba(255, 255, 255, 0.44), rgba(244, 249, 255, 0.22)),
        radial-gradient(circle at top left, rgba(79, 209, 197, 0.18), transparent 36%),
        radial-gradient(circle at 85% 18%, rgba(255, 138, 91, 0.16), transparent 26%),
        rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(18px) saturate(145%);
      -webkit-backdrop-filter: blur(18px) saturate(145%);
      box-shadow:
        0 18px 40px rgba(24, 48, 79, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);
      color: var(--darkgray);
      isolation: isolate;
    }

    .np-glow {
      position: absolute;
      border-radius: 999px;
      filter: blur(20px);
      opacity: 0.6;
      z-index: -1;
    }

    .np-glow-one {
      top: -1.5rem;
      right: 0.5rem;
      width: 7rem;
      height: 7rem;
      background: rgba(79, 209, 197, 0.22);
    }

    .np-glow-two {
      bottom: -2rem;
      left: 3rem;
      width: 8rem;
      height: 8rem;
      background: rgba(255, 138, 91, 0.18);
    }

    .np-cover-shell {
      position: relative;
      width: 88px;
      aspect-ratio: 1;
      line-height: 0;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 12px 22px rgba(18, 32, 54, 0.2);
      background: linear-gradient(160deg, rgba(79, 209, 197, 0.8), rgba(255, 138, 91, 0.82));
    }

    .np-cover,
    .np-cover-fallback {
      width: 100%;
      height: 100%;
    }

    .np-cover {
      display: none;
      margin: 0;
      object-fit: cover;
      object-position: center center;
      vertical-align: top;
    }

    .np-cover.is-visible {
      display: block;
    }

    .np-cover-fallback {
      display: grid;
      place-items: center;
      font-size: 2rem;
      color: white;
      background:
        linear-gradient(160deg, rgba(15, 23, 42, 0.18), rgba(15, 23, 42, 0.02)),
        linear-gradient(145deg, rgba(79, 209, 197, 0.95), rgba(255, 138, 91, 0.95));
    }

    .np-cover-fallback.is-hidden {
      display: none;
    }

    .np-body {
      min-width: 0;
    }

    .np-topline {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.45rem;
    }

    .np-kicker {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: color-mix(in srgb, var(--darkgray) 70%, var(--secondary) 30%);
    }

    .np-status {
      padding: 0.18rem 0.55rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.38);
      border: 1px solid rgba(79, 209, 197, 0.22);
      backdrop-filter: blur(10px) saturate(135%);
      -webkit-backdrop-filter: blur(10px) saturate(135%);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--np-ink);
      white-space: nowrap;
    }

    .np-track-link {
      display: inline-block;
      min-width: 0;
      color: inherit;
      text-decoration: none;
    }

    .np-title {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.2;
      color: var(--np-ink);
    }

    .np-track-link:hover {
      text-decoration: none;
    }

    .np-track-link:hover .np-title {
      color: var(--secondary);
    }

    .np-meta,
    .np-album {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .np-meta {
      margin-top: 0.18rem;
      font-size: 0.9rem;
      color: color-mix(in srgb, var(--darkgray) 82%, black 18%);
    }

    .np-album {
      margin-top: 0.25rem;
      font-size: 0.78rem;
      color: color-mix(in srgb, var(--darkgray) 62%, white 38%);
    }

    .np-wave-wrap {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.55rem;
      margin-top: 0.7rem;
      margin-bottom: 0.15rem;
    }

    .np-wave {
      width: 100%;
      height: 1.55rem;
      overflow: visible;
    }

    .np-wave-back,
    .np-wave-front {
      fill: none;
      stroke-linecap: round;
      stroke-width: 3;
    }

    .np-wave-back {
      stroke: rgba(79, 209, 197, 0.22);
    }

    .np-wave-front {
      stroke: var(--np-coral);
      stroke-dasharray: 12 10;
      animation: np-wave-slide 1.2s linear infinite;
    }

    .np-live {
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 999px;
      background: var(--np-coral);
      box-shadow: 0 0 0 0 rgba(255, 138, 91, 0.5);
      animation: np-pulse 1.2s infinite;
      flex-shrink: 0;
    }

    .np-wave-wrap.is-idle .np-wave-front {
      animation-duration: 4s;
      opacity: 0.5;
    }

    .np-wave-wrap.is-idle .np-live {
      display: none;
    }

    :root[saved-theme="dark"] .now-playing-widget {
      --np-ink: rgba(242, 247, 255, 0.96);
      border: 1px solid rgba(255, 255, 255, 0.1);
      background:
        linear-gradient(145deg, rgba(22, 29, 42, 0.5), rgba(11, 16, 26, 0.34)),
        radial-gradient(circle at top left, rgba(79, 209, 197, 0.18), transparent 38%),
        radial-gradient(circle at 85% 18%, rgba(255, 138, 91, 0.16), transparent 28%),
        rgba(10, 15, 24, 0.28);
      backdrop-filter: blur(18px) saturate(145%);
      -webkit-backdrop-filter: blur(18px) saturate(145%);
      box-shadow:
        0 22px 46px rgba(0, 0, 0, 0.24),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
      color: rgba(233, 241, 250, 0.92);
    }

    :root[saved-theme="dark"] .np-glow-one {
      background: rgba(79, 209, 197, 0.18);
      opacity: 0.8;
    }

    :root[saved-theme="dark"] .np-glow-two {
      background: rgba(255, 138, 91, 0.16);
      opacity: 0.75;
    }

    :root[saved-theme="dark"] .np-cover-shell {
      box-shadow:
        0 16px 28px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      background: linear-gradient(160deg, rgba(79, 209, 197, 0.72), rgba(255, 138, 91, 0.76));
    }

    :root[saved-theme="dark"] .np-cover-fallback {
      background:
        linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.01)),
        linear-gradient(145deg, rgba(79, 209, 197, 0.88), rgba(255, 138, 91, 0.9));
    }

    :root[saved-theme="dark"] .np-kicker {
      color: rgba(176, 229, 223, 0.82);
    }

    :root[saved-theme="dark"] .np-status {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(79, 209, 197, 0.16);
      color: rgba(245, 249, 255, 0.9);
    }

    :root[saved-theme="dark"] .np-track-link:hover .np-title {
      color: color-mix(in srgb, var(--secondary) 78%, white 22%);
    }

    :root[saved-theme="dark"] .np-meta {
      color: rgba(219, 227, 238, 0.84);
    }

    :root[saved-theme="dark"] .np-album {
      color: rgba(173, 184, 198, 0.74);
    }

    :root[saved-theme="dark"] .np-wave-back {
      stroke: rgba(79, 209, 197, 0.18);
    }

    @keyframes np-pulse {
      0%, 100% {
        opacity: 1;
        box-shadow: 0 0 0 0 rgba(255, 138, 91, 0.45);
      }

      50% {
        opacity: 0.35;
        box-shadow: 0 0 0 8px rgba(255, 138, 91, 0);
      }
    }

    @keyframes np-wave-slide {
      to {
        stroke-dashoffset: -44;
      }
    }

    @media (max-width: 640px) {
      .now-playing-widget {
        grid-template-columns: 72px minmax(0, 1fr);
        gap: 0.8rem;
        padding: 0.85rem;
      }

      .np-cover-shell {
        width: 72px;
      }

      .np-title {
        font-size: 0.98rem;
      }
    }
  `

  NowPlaying.afterDOMLoaded = `
    const NOW_PLAYING_CONFIG = {
      username: ${JSON.stringify(opts.username)},
      apiKey: ${JSON.stringify(opts.apiKey)},
      baseUrl: ${JSON.stringify(baseUrl)},
      emptyMessage: ${JSON.stringify(opts.emptyMessage)},
      errorMessage: ${JSON.stringify(opts.errorMessage)},
    }
    const addCleanup =
      typeof window.addCleanup === "function" ? window.addCleanup.bind(window) : () => {}

    function normalizeAssetUrl(url) {
      if (typeof url !== "string") return ""
      if (url.startsWith("http://")) return "https://" + url.slice("http://".length)
      return url
    }

    async function fetchNowPlaying() {
      const widgets = document.querySelectorAll("[data-now-playing-widget]")
      if (!widgets.length) return

      try {
        const url = new URL(NOW_PLAYING_CONFIG.baseUrl)
        url.searchParams.set("method", "user.getrecenttracks")
        url.searchParams.set("user", NOW_PLAYING_CONFIG.username)
        url.searchParams.set("api_key", NOW_PLAYING_CONFIG.apiKey)
        url.searchParams.set("format", "json")
        url.searchParams.set("limit", "1")

        const response = await fetch(url.toString())
        if (!response.ok) {
          throw new Error("request failed")
        }

        const data = await response.json()
        const rawTrack = data?.recenttracks?.track
        const track = Array.isArray(rawTrack) ? rawTrack[0] : rawTrack

        widgets.forEach((widget) => {
          const titleEl = widget.querySelector("[data-now-playing-title]")
          const metaEl = widget.querySelector("[data-now-playing-meta]")
          const albumEl = widget.querySelector("[data-now-playing-album]")
          const kickerEl = widget.querySelector("[data-now-playing-kicker]")
          const statusEl = widget.querySelector("[data-now-playing-status]")
          const linkEl = widget.querySelector("[data-now-playing-link]")
          const coverEl = widget.querySelector("[data-now-playing-cover]")
          const fallbackEl = widget.querySelector("[data-now-playing-fallback]")
          const liveEl = widget.querySelector("[data-now-playing-live]")
          const waveWrapEl = widget.querySelector(".np-wave-wrap")

          if (!titleEl || !metaEl || !albumEl || !kickerEl || !statusEl || !linkEl) return

          if (!track) {
            kickerEl.textContent = "Nothing recent"
            statusEl.textContent = "Idle"
            titleEl.textContent = NOW_PLAYING_CONFIG.emptyMessage
            metaEl.textContent = "Play something and this card will wake up."
            albumEl.textContent = "No recent track artwork found."
            linkEl.href = NOW_PLAYING_CONFIG.baseUrl
            waveWrapEl?.classList.add("is-idle")
            liveEl?.setAttribute("hidden", "")
            if (coverEl instanceof HTMLImageElement) {
              coverEl.src = ""
              coverEl.alt = ""
              coverEl.classList.remove("is-visible")
            }
            fallbackEl?.classList.remove("is-hidden")
            return
          }

          const isNowPlaying = track["@attr"]?.nowplaying === "true"
          const artist = track.artist?.["#text"] || "Unknown artist"
          const name = track.name || "Unknown track"
          const trackUrl = track.url || NOW_PLAYING_CONFIG.baseUrl
          const album = track.album?.["#text"] || "Single or unknown album"
          const images = Array.isArray(track.image) ? track.image : []
          const cover = normalizeAssetUrl([...images]
            .reverse()
            .find((image) => typeof image?.["#text"] === "string" && image["#text"].trim())?.[
            "#text"
          ])

          kickerEl.textContent = isNowPlaying ? "Now playing" : "Recently played"
          statusEl.textContent = isNowPlaying ? "Live" : "Recent"
          titleEl.textContent = name
          metaEl.textContent = artist
          albumEl.textContent = album
          linkEl.href = trackUrl
          waveWrapEl?.classList.toggle("is-idle", !isNowPlaying)

          if (isNowPlaying) {
            liveEl?.removeAttribute("hidden")
          } else {
            liveEl?.setAttribute("hidden", "")
          }

          if (coverEl instanceof HTMLImageElement && cover) {
            coverEl.src = cover
            coverEl.alt = artist + " - " + name + " cover art"
            coverEl.classList.add("is-visible")
            fallbackEl?.classList.add("is-hidden")
          } else {
            if (coverEl instanceof HTMLImageElement) {
              coverEl.src = ""
              coverEl.alt = ""
              coverEl.classList.remove("is-visible")
            }
            fallbackEl?.classList.remove("is-hidden")
          }
        })
      } catch (_err) {
        widgets.forEach((widget) => {
          const titleEl = widget.querySelector("[data-now-playing-title]")
          const metaEl = widget.querySelector("[data-now-playing-meta]")
          const albumEl = widget.querySelector("[data-now-playing-album]")
          const kickerEl = widget.querySelector("[data-now-playing-kicker]")
          const statusEl = widget.querySelector("[data-now-playing-status]")
          const liveEl = widget.querySelector("[data-now-playing-live]")
          const coverEl = widget.querySelector("[data-now-playing-cover]")
          const fallbackEl = widget.querySelector("[data-now-playing-fallback]")
          const waveWrapEl = widget.querySelector(".np-wave-wrap")

          if (titleEl) titleEl.textContent = NOW_PLAYING_CONFIG.errorMessage
          if (metaEl) metaEl.textContent = "The scrobble service did not respond."
          if (albumEl) albumEl.textContent = "Try again in a moment."
          if (kickerEl) kickerEl.textContent = "Connection issue"
          if (statusEl) statusEl.textContent = "Error"
          liveEl?.setAttribute("hidden", "")
          waveWrapEl?.classList.add("is-idle")
          if (coverEl instanceof HTMLImageElement) {
            coverEl.src = ""
            coverEl.alt = ""
            coverEl.classList.remove("is-visible")
          }
          fallbackEl?.classList.remove("is-hidden")
        })
      }
    }

    document.addEventListener("nav", fetchNowPlaying)
    addCleanup(() => {
      document.removeEventListener("nav", fetchNowPlaying)
    })
  `

  return NowPlaying
}) satisfies QuartzComponentConstructor<NowPlayingOptions>

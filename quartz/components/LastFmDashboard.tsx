import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface LastFmDashboardOptions {
  username: string
  apiKey: string
  useLibreFm?: boolean
  recentLimit?: number
  topLimit?: number
  refreshIntervalMs?: number
}

const defaultOptions = {
  useLibreFm: false,
  recentLimit: 6,
  topLimit: 5,
  refreshIntervalMs: 120000,
} satisfies Partial<LastFmDashboardOptions>

export default ((userOpts: LastFmDashboardOptions) => {
  const opts = { ...defaultOptions, ...userOpts }
  const baseUrl = opts.useLibreFm ? "https://libre.fm/2.0/" : "https://ws.audioscrobbler.com/2.0/"

  const periods = [
    { value: "1month", label: "This Month" },
    { value: "12month", label: "This Year" },
  ] as const

  const LastFmDashboard: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const recentSkeletonItems = Array.from({ length: opts.recentLimit ?? defaultOptions.recentLimit })
    const topSkeletonItems = Array.from({ length: opts.topLimit ?? defaultOptions.topLimit })
    const spotlightTrackSkeletonItems = Array.from({ length: 6 })
    const similarArtistSkeletonItems = Array.from({ length: 5 })

    return (
      <section
        class={classNames(displayClass, "lfm-dashboard")}
        data-lastfm-dashboard
        data-lfm-hydrated="false"
      >
        <div class="lfm-grid">
          <article class="lfm-card lfm-card-recent">
            <div class="lfm-card-head">
              <div>
                <p class="lfm-eyebrow">Recent Scrobbles</p>
                <h2>Latest listens</h2>
              </div>
            </div>
            <div class="lfm-row-header lfm-row-header-recent" aria-hidden="true">
              <span class="lfm-row-header-cover">Art</span>
              <span>Name</span>
              <span>Artist</span>
              <span>Album</span>
              <span>When</span>
            </div>
            <ol class="lfm-recent-list" data-lfm-recent-list>
              {recentSkeletonItems.map(() => (
                <li class="lfm-recent-item lfm-skeleton-item" aria-hidden="true">
                  <div class="lfm-cover-shell lfm-cover-shell-inline">
                    <div class="lfm-cover-fallback">♫</div>
                  </div>
                  <div class="lfm-item-copy lfm-recent-title-copy">
                    <span class="lfm-skeleton-line lfm-skeleton-line-title"></span>
                    <span class="lfm-skeleton-line lfm-skeleton-line-meta"></span>
                    <span class="lfm-skeleton-line lfm-skeleton-line-submeta"></span>
                  </div>
                  <span class="lfm-row-cell lfm-row-cell-artist lfm-skeleton-line"></span>
                  <span class="lfm-row-cell lfm-row-cell-album lfm-skeleton-line"></span>
                  <span class="lfm-playcount lfm-skeleton-line lfm-skeleton-line-time"></span>
                </li>
              ))}
            </ol>
          </article>

          <article class="lfm-card lfm-card-top-slice">
            <div class="lfm-panel-head">
              <div>
                <p class="lfm-eyebrow">Top Listening</p>
                <h2>Top tracks</h2>
              </div>
              <div class="lfm-period-tabs">
                {periods.map((period, index) => (
                  <button
                    type="button"
                    class={`lfm-period-tab${index === 0 ? " is-active" : ""}`}
                    data-lfm-period={period.value}
                    data-lfm-kind="tracks"
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
            <div class="lfm-row-header lfm-row-header-top" aria-hidden="true">
              <span class="lfm-row-header-cover">Art</span>
              <span>#</span>
              <span>Name</span>
              <span>Artist</span>
              <span>Plays</span>
            </div>
            <ol class="lfm-ranked-list" data-lfm-top-list="tracks">
              {topSkeletonItems.map((_, index) => (
                <li class="lfm-ranked-item lfm-skeleton-item" aria-hidden="true">
                  <div class="lfm-cover-shell lfm-cover-shell-inline">
                    <div class="lfm-cover-fallback">♫</div>
                  </div>
                  <span class="lfm-rank">#{index + 1}</span>
                  <div class="lfm-item-copy lfm-ranked-title-copy">
                    <span class="lfm-skeleton-line lfm-skeleton-line-title"></span>
                    <span class="lfm-skeleton-line lfm-skeleton-line-meta"></span>
                  </div>
                  <span class="lfm-row-cell lfm-row-cell-context lfm-skeleton-line"></span>
                  <span class="lfm-playcount lfm-skeleton-line lfm-skeleton-line-time"></span>
                </li>
              ))}
            </ol>
          </article>

          <article class="lfm-card lfm-card-top-slice">
            <div class="lfm-panel-head">
              <div>
                <p class="lfm-eyebrow">Top Listening</p>
                <h2>Top artists</h2>
              </div>
              <div class="lfm-period-tabs">
                {periods.map((period, index) => (
                  <button
                    type="button"
                    class={`lfm-period-tab${index === 0 ? " is-active" : ""}`}
                    data-lfm-period={period.value}
                    data-lfm-kind="artists"
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
            <div class="lfm-row-header lfm-row-header-top" aria-hidden="true">
              <span class="lfm-row-header-cover">Art</span>
              <span>#</span>
              <span>Name</span>
              <span>Context</span>
              <span>Plays</span>
            </div>
            <ol class="lfm-ranked-list" data-lfm-top-list="artists">
              {topSkeletonItems.map((_, index) => (
                <li class="lfm-ranked-item lfm-skeleton-item" aria-hidden="true">
                  <div class="lfm-cover-shell lfm-cover-shell-inline">
                    <div class="lfm-cover-fallback">ART</div>
                  </div>
                  <span class="lfm-rank">#{index + 1}</span>
                  <div class="lfm-item-copy lfm-ranked-title-copy">
                    <span class="lfm-skeleton-line lfm-skeleton-line-title"></span>
                    <span class="lfm-skeleton-line lfm-skeleton-line-meta"></span>
                  </div>
                  <span class="lfm-row-cell lfm-row-cell-context lfm-skeleton-line"></span>
                  <span class="lfm-playcount lfm-skeleton-line lfm-skeleton-line-time"></span>
                </li>
              ))}
            </ol>
          </article>

          <article class="lfm-card lfm-card-top-slice">
            <div class="lfm-panel-head">
              <div>
                <p class="lfm-eyebrow">Top Listening</p>
                <h2>Top albums</h2>
              </div>
              <div class="lfm-period-tabs">
                {periods.map((period, index) => (
                  <button
                    type="button"
                    class={`lfm-period-tab${index === 0 ? " is-active" : ""}`}
                    data-lfm-period={period.value}
                    data-lfm-kind="albums"
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
            <div class="lfm-row-header lfm-row-header-top" aria-hidden="true">
              <span class="lfm-row-header-cover">Art</span>
              <span>#</span>
              <span>Name</span>
              <span>Artist</span>
              <span>Plays</span>
            </div>
            <ol class="lfm-ranked-list" data-lfm-top-list="albums">
              {topSkeletonItems.map((_, index) => (
                <li class="lfm-ranked-item lfm-skeleton-item" aria-hidden="true">
                  <div class="lfm-cover-shell lfm-cover-shell-inline">
                    <div class="lfm-cover-fallback">LP</div>
                  </div>
                  <span class="lfm-rank">#{index + 1}</span>
                  <div class="lfm-item-copy lfm-ranked-title-copy">
                    <span class="lfm-skeleton-line lfm-skeleton-line-title"></span>
                    <span class="lfm-skeleton-line lfm-skeleton-line-meta"></span>
                  </div>
                  <span class="lfm-row-cell lfm-row-cell-context lfm-skeleton-line"></span>
                  <span class="lfm-playcount lfm-skeleton-line lfm-skeleton-line-time"></span>
                </li>
              ))}
            </ol>
          </article>

          <article class="lfm-card lfm-card-spotlight" data-lfm-spotlight="album">
            <div class="lfm-card-head">
              <div>
                <p class="lfm-eyebrow">Album Spotlight</p>
                <h2 data-lfm-album-title>Loading album</h2>
              </div>
              <span class="lfm-chip" data-lfm-album-chip>
                Recent pick
              </span>
            </div>
            <div class="lfm-spotlight-hero">
              <div class="lfm-cover-shell lfm-cover-shell-large">
                <img
                  class="lfm-cover"
                  data-lfm-album-cover
                  src=""
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div class="lfm-cover-fallback" data-lfm-album-fallback aria-hidden="true">
                  LP
                </div>
              </div>
              <div class="lfm-spotlight-copy">
                <a
                  class="lfm-spotlight-link"
                  data-lfm-album-link
                  href={baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open on Last.fm
                </a>
                <p class="lfm-spotlight-meta" data-lfm-album-meta>
                  Waiting for album metadata.
                </p>
                <div class="lfm-stat-row" data-lfm-album-stats></div>
                <p class="lfm-summary" data-lfm-album-summary>
                  Tracklist and stats will land here.
                </p>
              </div>
            </div>
            <div>
              <p class="lfm-subtitle">Tracks</p>
              <ol class="lfm-mini-list" data-lfm-album-tracks>
                {spotlightTrackSkeletonItems.map(() => (
                  <li class="lfm-mini-item lfm-skeleton-mini-item" aria-hidden="true">
                    <span class="lfm-skeleton-line lfm-skeleton-line-mini-index"></span>
                    <span class="lfm-skeleton-line lfm-skeleton-line-mini-title"></span>
                    <span class="lfm-skeleton-line lfm-skeleton-line-mini-time"></span>
                  </li>
                ))}
              </ol>
            </div>
          </article>

          <article class="lfm-card lfm-card-spotlight" data-lfm-spotlight="artist">
            <div class="lfm-card-head">
              <div>
                <p class="lfm-eyebrow">Artist Spotlight</p>
                <h2 data-lfm-artist-title>Loading artist</h2>
              </div>
              <span class="lfm-chip" data-lfm-artist-chip>
                From latest track
              </span>
            </div>
            <div class="lfm-spotlight-hero">
              <div class="lfm-cover-shell lfm-cover-shell-large">
                <img
                  class="lfm-cover"
                  data-lfm-artist-cover
                  src=""
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div class="lfm-cover-fallback" data-lfm-artist-fallback aria-hidden="true">
                  ART
                </div>
              </div>
              <div class="lfm-spotlight-copy">
                <a
                  class="lfm-spotlight-link"
                  data-lfm-artist-link
                  href={baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open on Last.fm
                </a>
                <p class="lfm-spotlight-meta" data-lfm-artist-meta>
                  Waiting for artist metadata.
                </p>
                <div class="lfm-stat-row" data-lfm-artist-stats></div>
                <p class="lfm-summary" data-lfm-artist-summary>
                  Bio, tags, and similar artists will show here.
                </p>
              </div>
            </div>
            <div>
              <p class="lfm-subtitle">Similar artists</p>
              <div class="lfm-pill-row" data-lfm-artist-similar>
                {similarArtistSkeletonItems.map(() => (
                  <span class="lfm-pill lfm-skeleton-pill" aria-hidden="true"></span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>
    )
  }

  LastFmDashboard.css = `
    .lfm-dashboard {
      margin-top: 1.1rem;
    }

    .lfm-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(12, minmax(0, 1fr));
    }

    .lfm-card {
      position: relative;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--secondary) 14%, white 86%);
      border-radius: 1.4rem;
      background:
        linear-gradient(165deg, rgba(255, 255, 255, 0.42), rgba(246, 249, 255, 0.2)),
        radial-gradient(circle at top left, rgba(83, 155, 245, 0.1), transparent 34%),
        radial-gradient(circle at 90% 16%, rgba(240, 93, 80, 0.1), transparent 26%),
        rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(18px) saturate(145%);
      -webkit-backdrop-filter: blur(18px) saturate(145%);
      box-shadow:
        0 18px 34px rgba(17, 37, 68, 0.07),
        inset 0 1px 0 rgba(255, 255, 255, 0.48);
      padding: 1rem;
    }

    .lfm-card-recent {
      grid-column: 1 / -1;
    }

    .lfm-card-top-slice {
      grid-column: 1 / -1;
    }

    .lfm-card-spotlight {
      grid-column: span 6;
    }

    .lfm-card-head,
    .lfm-panel-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .lfm-card-head h2 {
      margin: 0.1rem 0 0;
      font-size: 1.08rem;
      line-height: 1.2;
      color: color-mix(in srgb, var(--darkgray) 85%, black 15%);
    }

    .lfm-eyebrow,
    .lfm-subtitle {
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.72rem;
      font-weight: 700;
      color: color-mix(in srgb, var(--secondary) 56%, var(--darkgray) 44%);
    }

    .lfm-panel-head h2 {
      margin: 0.1rem 0 0;
      font-size: 1.08rem;
      line-height: 1.2;
      color: color-mix(in srgb, var(--darkgray) 85%, black 15%);
    }

    .lfm-chip {
      align-self: flex-start;
      padding: 0.24rem 0.62rem;
      border-radius: 999px;
      border: 1px solid rgba(83, 155, 245, 0.16);
      background: rgba(255, 255, 255, 0.34);
      backdrop-filter: blur(10px) saturate(135%);
      -webkit-backdrop-filter: blur(10px) saturate(135%);
      font-size: 0.72rem;
      font-weight: 700;
      color: color-mix(in srgb, var(--darkgray) 78%, black 22%);
      white-space: nowrap;
    }

    .lfm-recent-list,
    .lfm-ranked-list,
    .lfm-mini-list {
      list-style: none;
      margin: 1rem 0 0;
      padding: 0;
    }

    .lfm-recent-list {
      display: grid;
      gap: 0.75rem;
    }

    .lfm-row-header {
      display: grid;
      gap: 0.8rem;
      margin-top: 1rem;
      padding: 0 0 0.55rem;
      border-bottom: 1px solid rgba(15, 23, 42, 0.08);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.7rem;
      font-weight: 700;
      color: color-mix(in srgb, var(--darkgray) 58%, white 42%);
    }

    .lfm-row-header-recent {
      grid-template-columns: 52px minmax(0, 2.2fr) minmax(180px, 1.4fr) minmax(180px, 1.4fr) minmax(140px, 0.8fr);
    }

    .lfm-row-header-top {
      grid-template-columns: 52px 2.5rem minmax(0, 2.2fr) minmax(180px, 1.3fr) minmax(120px, 0.8fr);
    }

    .lfm-row-header-cover {
      opacity: 0;
    }

    .lfm-recent-item,
    .lfm-ranked-item {
      display: grid;
      gap: 0.7rem;
      align-items: center;
      min-width: 0;
    }

    .lfm-recent-item {
      grid-template-columns: 52px minmax(0, 2.2fr) minmax(180px, 1.4fr) minmax(180px, 1.4fr) minmax(140px, 0.8fr);
      padding: 0.7rem 0;
      border-top: 1px solid rgba(15, 23, 42, 0.06);
    }

    .lfm-ranked-item {
      grid-template-columns: 52px 2.5rem minmax(0, 2.2fr) minmax(180px, 1.3fr) minmax(120px, 0.8fr);
      padding: 0.7rem 0;
      border-top: 1px solid rgba(15, 23, 42, 0.06);
    }

    .lfm-ranked-item:first-child {
      border-top: 0;
      padding-top: 0.15rem;
    }

    .lfm-recent-item:first-child {
      border-top: 0;
      padding-top: 0.15rem;
    }

    .lfm-rank {
      font-size: 0.78rem;
      font-weight: 700;
      color: color-mix(in srgb, var(--darkgray) 60%, white 40%);
    }

    .lfm-cover-shell {
      position: relative;
      width: 52px;
      aspect-ratio: 1;
      line-height: 0;
      border-radius: 0.95rem;
      overflow: hidden;
      background: linear-gradient(145deg, rgba(83, 155, 245, 0.82), rgba(240, 93, 80, 0.84));
      box-shadow: 0 12px 20px rgba(17, 37, 68, 0.16);
      flex-shrink: 0;
    }

    .lfm-cover-shell-large {
      width: 120px;
      border-radius: 1.2rem;
    }

    .lfm-cover-shell-inline {
      width: 52px;
      border-radius: 0.8rem;
      box-shadow: 0 10px 18px rgba(17, 37, 68, 0.14);
    }

    .lfm-cover,
    .lfm-cover-fallback {
      width: 100%;
      height: 100%;
    }

    .lfm-cover {
      display: block;
      margin: 0;
      object-fit: cover;
      object-position: center center;
      vertical-align: top;
    }

    .lfm-cover.is-visible {
      display: block;
    }

    .lfm-cover-fallback {
      display: grid;
      place-items: center;
      line-height: 1;
      color: white;
      font-size: 1rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      background:
        linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
        linear-gradient(145deg, rgba(83, 155, 245, 0.92), rgba(240, 93, 80, 0.9));
    }

    .lfm-cover-fallback.is-hidden {
      display: none;
    }

    .lfm-item-copy,
    .lfm-spotlight-copy {
      min-width: 0;
      overflow: hidden;
    }

    .lfm-inline-meta,
    .lfm-inline-submeta {
      display: none;
    }

    .lfm-row-link,
    .lfm-item-title,
    .lfm-spotlight-link {
      display: inline-block;
      color: inherit;
      text-decoration: none;
    }

    .lfm-row-link {
      display: block;
      width: 100%;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.92rem;
      font-weight: 700;
      color: color-mix(in srgb, var(--darkgray) 84%, black 16%);
    }

    .lfm-row-link:hover {
      color: var(--secondary);
      text-decoration: none;
    }

    .lfm-row-cell {
      display: block;
      width: 100%;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.85rem;
      color: color-mix(in srgb, var(--darkgray) 72%, white 28%);
    }

    .lfm-item-title strong,
    .lfm-spotlight-link {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: color-mix(in srgb, var(--darkgray) 84%, black 16%);
    }

    .lfm-item-title strong {
      font-size: 0.95rem;
    }

    .lfm-item-title:hover strong,
    .lfm-spotlight-link:hover {
      color: var(--secondary);
      text-decoration: none;
    }

    .lfm-item-meta,
    .lfm-item-submeta,
    .lfm-spotlight-meta,
    .lfm-summary {
      margin: 0;
      color: color-mix(in srgb, var(--darkgray) 72%, white 28%);
    }

    .lfm-item-meta,
    .lfm-item-submeta {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .lfm-item-meta {
      margin-top: 0.15rem;
      font-size: 0.87rem;
    }

    .lfm-item-submeta {
      margin-top: 0.1rem;
      font-size: 0.77rem;
    }

    .lfm-recent-item .lfm-playcount,
    .lfm-ranked-item .lfm-playcount {
      align-self: center;
    }

    .lfm-playcount {
      justify-self: end;
      text-align: right;
      font-size: 0.78rem;
      font-weight: 700;
      color: color-mix(in srgb, var(--secondary) 62%, var(--darkgray) 38%);
      white-space: nowrap;
    }

    .lfm-period-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      justify-content: flex-end;
    }

    .lfm-period-tab {
      border: 1px solid rgba(83, 155, 245, 0.14);
      border-radius: 999px;
      padding: 0.35rem 0.65rem;
      background: rgba(255, 255, 255, 0.34);
      backdrop-filter: blur(10px) saturate(135%);
      -webkit-backdrop-filter: blur(10px) saturate(135%);
      color: color-mix(in srgb, var(--darkgray) 74%, black 26%);
      font: inherit;
      font-size: 0.76rem;
      font-weight: 700;
      cursor: pointer;
      transition:
        transform 120ms ease,
        border-color 120ms ease,
        background 120ms ease;
    }

    .lfm-period-tab:hover {
      transform: translateY(-1px);
      border-color: rgba(83, 155, 245, 0.28);
    }

    .lfm-period-tab.is-active {
      background: linear-gradient(135deg, rgba(83, 155, 245, 0.18), rgba(240, 93, 80, 0.16));
      border-color: rgba(83, 155, 245, 0.34);
      color: color-mix(in srgb, var(--secondary) 72%, var(--darkgray) 28%);
    }

    .lfm-spotlight-hero {
      display: grid;
      grid-template-columns: 120px minmax(0, 1fr);
      gap: 0.9rem;
      align-items: start;
      margin-top: 1rem;
      margin-bottom: 0.9rem;
    }

    .lfm-spotlight-link {
      font-size: 0.96rem;
      font-weight: 700;
    }

    .lfm-spotlight-meta {
      margin-top: 0.22rem;
      font-size: 0.9rem;
    }

    .lfm-stat-row,
    .lfm-pill-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin-top: 0.7rem;
    }

    .lfm-stat,
    .lfm-pill {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 0.28rem 0.62rem;
      background: rgba(83, 155, 245, 0.1);
      color: color-mix(in srgb, var(--darkgray) 76%, black 24%);
      font-size: 0.76rem;
      font-weight: 700;
    }

    .lfm-summary {
      margin-top: 0.8rem;
      font-size: 0.86rem;
      line-height: 1.55;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      overflow: hidden;
    }

    .lfm-mini-list {
      display: grid;
      gap: 0.55rem;
      margin-top: 0.6rem;
      counter-reset: lfm-mini;
    }

    .lfm-mini-item {
      display: grid;
      grid-template-columns: 1.6rem minmax(0, 1fr) auto;
      gap: 0.55rem;
      align-items: center;
    }

    .lfm-mini-item::before {
      counter-increment: lfm-mini;
      content: counter(lfm-mini);
      font-size: 0.76rem;
      font-weight: 700;
      color: color-mix(in srgb, var(--darkgray) 58%, white 42%);
    }

    .lfm-mini-track {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.88rem;
      color: color-mix(in srgb, var(--darkgray) 80%, black 20%);
    }

    .lfm-mini-duration {
      font-size: 0.74rem;
      color: color-mix(in srgb, var(--darkgray) 62%, white 38%);
    }

    .lfm-empty-state {
      color: color-mix(in srgb, var(--darkgray) 64%, white 36%);
      font-size: 0.84rem;
    }

    .lfm-skeleton-item {
      pointer-events: none;
    }

    .lfm-skeleton-line,
    .lfm-skeleton-pill {
      display: block;
      border-radius: 999px;
      background:
        linear-gradient(
          90deg,
          rgba(83, 155, 245, 0.12) 0%,
          rgba(255, 255, 255, 0.45) 45%,
          rgba(83, 155, 245, 0.12) 100%
        );
      background-size: 200% 100%;
      animation: lfm-skeleton-shimmer 1.4s ease-in-out infinite;
    }

    .lfm-skeleton-line {
      height: 0.82rem;
    }

    .lfm-skeleton-line-title {
      width: 78%;
      height: 0.92rem;
    }

    .lfm-skeleton-line-meta {
      width: 56%;
      margin-top: 0.2rem;
    }

    .lfm-skeleton-line-submeta {
      width: 62%;
      margin-top: 0.12rem;
      height: 0.74rem;
    }

    .lfm-skeleton-line-time {
      width: 4.4rem;
      justify-self: end;
    }

    .lfm-skeleton-mini-item {
      pointer-events: none;
    }

    .lfm-skeleton-mini-item::before {
      content: "";
      counter-increment: none;
    }

    .lfm-skeleton-line-mini-index {
      width: 0.9rem;
      height: 0.72rem;
    }

    .lfm-skeleton-line-mini-title {
      width: 72%;
      height: 0.82rem;
    }

    .lfm-skeleton-line-mini-time {
      width: 2.2rem;
      height: 0.72rem;
      justify-self: end;
    }

    .lfm-skeleton-pill {
      width: 7rem;
      height: 2rem;
    }

    [data-lastfm-dashboard][data-lfm-hydrated="false"] .lfm-summary {
      min-height: calc(1.55em * 5);
    }

    [data-lastfm-dashboard][data-lfm-hydrated="false"] .lfm-pill-row {
      min-height: 5.2rem;
      align-content: flex-start;
    }

    @keyframes lfm-skeleton-shimmer {
      0% {
        background-position: 200% 0;
      }

      100% {
        background-position: -200% 0;
      }
    }

    :root[saved-theme="dark"] .lfm-card {
      border-color: rgba(255, 255, 255, 0.1);
      background:
        linear-gradient(155deg, rgba(18, 24, 35, 0.48), rgba(10, 14, 23, 0.32)),
        radial-gradient(circle at top left, rgba(83, 155, 245, 0.14), transparent 36%),
        radial-gradient(circle at 90% 16%, rgba(240, 93, 80, 0.14), transparent 28%),
        rgba(10, 15, 24, 0.24);
      backdrop-filter: blur(18px) saturate(145%);
      -webkit-backdrop-filter: blur(18px) saturate(145%);
      box-shadow:
        0 22px 40px rgba(0, 0, 0, 0.24),
        inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    :root[saved-theme="dark"] .lfm-card-head h2,
    :root[saved-theme="dark"] .lfm-panel-head h2,
    :root[saved-theme="dark"] .lfm-row-link,
    :root[saved-theme="dark"] .lfm-item-title strong,
    :root[saved-theme="dark"] .lfm-spotlight-link,
    :root[saved-theme="dark"] .lfm-mini-track {
      color: rgba(241, 246, 255, 0.95);
    }

    :root[saved-theme="dark"] .lfm-row-header {
      border-bottom-color: rgba(255, 255, 255, 0.08);
      color: rgba(162, 175, 194, 0.76);
    }

    :root[saved-theme="dark"] .lfm-row-cell,
    :root[saved-theme="dark"] .lfm-item-meta,
    :root[saved-theme="dark"] .lfm-item-submeta,
    :root[saved-theme="dark"] .lfm-spotlight-meta,
    :root[saved-theme="dark"] .lfm-summary,
    :root[saved-theme="dark"] .lfm-empty-state,
    :root[saved-theme="dark"] .lfm-mini-duration {
      color: rgba(184, 195, 210, 0.8);
    }

    :root[saved-theme="dark"] .lfm-skeleton-line,
    :root[saved-theme="dark"] .lfm-skeleton-pill {
      background:
        linear-gradient(
          90deg,
          rgba(83, 155, 245, 0.16) 0%,
          rgba(255, 255, 255, 0.12) 45%,
          rgba(83, 155, 245, 0.16) 100%
        );
      background-size: 200% 100%;
    }

    :root[saved-theme="dark"] .lfm-chip,
    :root[saved-theme="dark"] .lfm-period-tab {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      color: rgba(233, 239, 247, 0.92);
    }

    :root[saved-theme="dark"] .lfm-period-tab.is-active,
    :root[saved-theme="dark"] .lfm-stat,
    :root[saved-theme="dark"] .lfm-pill {
      background: rgba(83, 155, 245, 0.16);
      border-color: rgba(83, 155, 245, 0.28);
    }

    :root[saved-theme="dark"] .lfm-ranked-item {
      border-top-color: rgba(255, 255, 255, 0.08);
    }

    @media (max-width: 1100px) {
      .lfm-card-recent,
      .lfm-card-top-slice,
      .lfm-card-spotlight {
        grid-column: span 12;
      }
    }

    @media (max-width: 1536px) {
      .lfm-row-header-recent,
      .lfm-row-header-top {
        display: none;
      }

      .lfm-recent-list,
      .lfm-ranked-list {
        gap: 0.9rem;
      }

      .lfm-recent-item,
      .lfm-ranked-item {
        grid-template-columns: 52px minmax(0, 1fr) auto;
        gap: 0.7rem 0.85rem;
        align-items: start;
        padding: 0.85rem 0;
      }

      .lfm-ranked-item {
        grid-template-columns: 52px 2.5rem minmax(0, 1fr) auto;
      }

      .lfm-recent-item .lfm-row-cell-artist,
      .lfm-recent-item .lfm-row-cell-album,
      .lfm-ranked-item .lfm-row-cell-context {
        display: none;
      }

      .lfm-recent-title-copy,
      .lfm-ranked-title-copy {
        align-self: center;
      }

      .lfm-inline-meta,
      .lfm-inline-submeta {
        display: block;
      }
    }

    @media (max-width: 980px) {
      .lfm-spotlight-hero {
        grid-template-columns: 96px minmax(0, 1fr);
      }

      .lfm-cover-shell-large {
        width: 96px;
      }
    }

    @media (max-width: 860px) {
      .lfm-recent-item {
        grid-template-columns: 44px minmax(0, 1fr) auto;
      }

      .lfm-spotlight-hero {
        grid-template-columns: 84px minmax(0, 1fr);
      }

      .lfm-cover-shell-large {
        width: 84px;
      }
    }

    @media (max-width: 640px) {
      .lfm-card {
        padding: 0.9rem;
      }

      .lfm-card-head,
      .lfm-panel-head {
        flex-direction: column;
      }

      .lfm-period-tabs {
        justify-content: flex-start;
      }

      .lfm-card-head .lfm-chip {
        align-self: flex-start;
      }

      .lfm-ranked-item {
        gap: 0.55rem 0.75rem;
      }

      .lfm-recent-list,
      .lfm-ranked-list {
        gap: 0.7rem;
      }

      .lfm-recent-item {
        grid-template-columns: 44px minmax(0, 1fr) auto;
        gap: 0.5rem 0.7rem;
        padding: 0.65rem 0;
        align-items: center;
      }

      .lfm-ranked-item {
        grid-template-columns: 44px minmax(0, 1fr) auto;
        grid-template-rows: auto auto;
        gap: 0.3rem 0.75rem;
        padding: 0.65rem 0;
        align-items: start;
      }

      .lfm-ranked-item .lfm-cover-shell {
        grid-column: 1;
        grid-row: 1;
      }

      .lfm-ranked-item .lfm-rank {
        grid-column: 1;
        grid-row: 2;
        justify-self: center;
        align-self: start;
        line-height: 1;
      }

      .lfm-ranked-item .lfm-ranked-title-copy,
      .lfm-recent-item .lfm-recent-title-copy {
        grid-column: 2;
      }

      .lfm-ranked-item .lfm-ranked-title-copy {
        grid-row: 1 / span 2;
        align-self: center;
      }

      .lfm-recent-item .lfm-playcount,
      .lfm-ranked-item .lfm-playcount {
        grid-column: 3;
        justify-self: end;
        text-align: right;
      }

      .lfm-recent-item .lfm-playcount {
        align-self: center;
      }

      .lfm-ranked-item .lfm-playcount {
        grid-row: 1 / span 2;
        align-self: center;
      }

      .lfm-item-meta {
        margin-top: 0.12rem;
        font-size: 0.84rem;
      }

      .lfm-recent-item .lfm-item-meta {
        margin-top: 0.18rem;
      }

      .lfm-item-submeta {
        margin-top: 0.08rem;
        font-size: 0.75rem;
      }

      .lfm-recent-item .lfm-item-submeta {
        margin-top: 0.03rem;
      }

      .lfm-playcount {
        font-size: 0.74rem;
      }

      .lfm-cover-shell,
      .lfm-cover-shell-inline {
        width: 44px;
      }

      .lfm-cover-shell-large {
        width: 80px;
      }
    }
  `

  LastFmDashboard.afterDOMLoaded = `
    const LASTFM_DASHBOARD_CONFIG = {
      username: ${JSON.stringify(opts.username)},
      apiKey: ${JSON.stringify(opts.apiKey)},
      baseUrl: ${JSON.stringify(baseUrl)},
      recentLimit: ${JSON.stringify(opts.recentLimit)},
      topLimit: ${JSON.stringify(opts.topLimit)},
      refreshIntervalMs: ${JSON.stringify(opts.refreshIntervalMs)},
    }
    const addCleanup =
      typeof window.addCleanup === "function" ? window.addCleanup.bind(window) : () => {}
    const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })
    const topItemDetailsCache = new Map()

    function normalizeAssetUrl(url) {
      if (typeof url !== "string") return ""
      if (url.startsWith("http://")) return "https://" + url.slice("http://".length)
      return url
    }

    function buildApiUrl(method, extraParams = {}) {
      const url = new URL(LASTFM_DASHBOARD_CONFIG.baseUrl)
      url.searchParams.set("method", method)
      url.searchParams.set("user", LASTFM_DASHBOARD_CONFIG.username)
      url.searchParams.set("api_key", LASTFM_DASHBOARD_CONFIG.apiKey)
      url.searchParams.set("format", "json")

      Object.entries(extraParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value))
        }
      })

      return url.toString()
    }

    async function fetchJson(url) {
      const response = await fetch(url)
      if (!response.ok) throw new Error("request failed")
      return response.json()
    }

    async function fetchJsonCached(url) {
      if (!topItemDetailsCache.has(url)) {
        topItemDetailsCache.set(
          url,
          fetchJson(url).catch((error) => {
            topItemDetailsCache.delete(url)
            throw error
          }),
        )
      }

      return topItemDetailsCache.get(url)
    }

    function pickLargestImage(images) {
      const safeImages = Array.isArray(images) ? images : []
      for (let index = safeImages.length - 1; index >= 0; index -= 1) {
        const value = normalizeAssetUrl(safeImages[index]?.["#text"])
        if (value && !value.includes("2a96cbd8b46e442fc41c2b86b821562f")) return value
      }
      return ""
    }

    function textOf(value) {
      if (typeof value === "string") return value
      if (value && typeof value === "object") {
        if (typeof value["#text"] === "string") return value["#text"]
        if (typeof value.name === "string") return value.name
      }
      return ""
    }

    function getArtistName(track) {
      return textOf(track?.artist) || "Unknown artist"
    }

    function getAlbumName(track) {
      return textOf(track?.album)
    }

    function getTrackTimestamp(track) {
      const uts = track?.date?.uts
      if (!uts) return null
      const timestamp = Number(uts) * 1000
      return Number.isFinite(timestamp) ? timestamp : null
    }

    function formatRelativeTime(timestamp) {
      if (!timestamp) return "Recently played"
      const diffSeconds = Math.round((timestamp - Date.now()) / 1000)
      const absSeconds = Math.abs(diffSeconds)
      if (absSeconds < 60) return relativeFormatter.format(diffSeconds, "second")
      const diffMinutes = Math.round(diffSeconds / 60)
      if (Math.abs(diffMinutes) < 60) return relativeFormatter.format(diffMinutes, "minute")
      const diffHours = Math.round(diffSeconds / 3600)
      if (Math.abs(diffHours) < 24) return relativeFormatter.format(diffHours, "hour")
      const diffDays = Math.round(diffSeconds / 86400)
      return relativeFormatter.format(diffDays, "day")
    }

    function formatNumber(value) {
      const amount = Number(value)
      if (!Number.isFinite(amount)) return value || "0"
      return new Intl.NumberFormat().format(amount)
    }

    function stripHtml(input) {
      if (typeof input !== "string") return ""
      return input.replace(/<[^>]+>/g, " ").replace(/\\s+/g, " ").trim()
    }

    function formatDuration(value) {
      const totalSeconds = Number(value)
      if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return ""
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      return minutes + ":" + String(seconds).padStart(2, "0")
    }

    async function enrichTopTrack(item) {
      const artist = textOf(item?.artist)
      const track = item?.name
      const existingImage = pickLargestImage(item?.image)
      if (!artist || !track || existingImage) return item

      try {
        const data = await fetchJsonCached(
          buildApiUrl("track.getinfo", {
            artist,
            track,
            username: LASTFM_DASHBOARD_CONFIG.username,
            autocorrect: 1,
          }),
        )
        const trackInfo = data?.track
        const image =
          pickLargestImage(trackInfo?.album?.image) ||
          pickLargestImage(trackInfo?.image) ||
          existingImage

        return image
          ? {
              ...item,
              image: [{ "#text": image }],
              url: item?.url || trackInfo?.url || LASTFM_DASHBOARD_CONFIG.baseUrl,
            }
          : item
      } catch (_error) {
        return item
      }
    }

    async function enrichTopArtist(item) {
      const artist = item?.name
      const existingImage = pickLargestImage(item?.image)
      if (!artist || existingImage) return item

      try {
        const data = await fetchJsonCached(
          buildApiUrl("artist.getinfo", {
            artist,
            username: LASTFM_DASHBOARD_CONFIG.username,
            autocorrect: 1,
          }),
        )
        const artistInfo = data?.artist
        const image = pickLargestImage(artistInfo?.image) || existingImage

        return image
          ? {
              ...item,
              image: [{ "#text": image }],
              url: item?.url || artistInfo?.url || LASTFM_DASHBOARD_CONFIG.baseUrl,
            }
          : item
      } catch (_error) {
        return item
      }
    }

    function setCover(widget, key, imageUrl, altText) {
      const coverEl = widget.querySelector("[data-lfm-" + key + "-cover]")
      const fallbackEl = widget.querySelector("[data-lfm-" + key + "-fallback]")
      if (!(coverEl instanceof HTMLImageElement)) return

      if (imageUrl) {
        coverEl.src = imageUrl
        coverEl.alt = altText
        coverEl.classList.add("is-visible")
        fallbackEl?.classList.add("is-hidden")
      } else {
        coverEl.src = ""
        coverEl.alt = ""
        coverEl.classList.remove("is-visible")
        fallbackEl?.classList.remove("is-hidden")
      }
    }

    function renderRecent(widget, tracks) {
      const listEl = widget.querySelector("[data-lfm-recent-list]")
      if (!listEl) return

      if (!tracks.length) {
        listEl.innerHTML = '<li class="lfm-empty-state">No recent scrobbles found.</li>'
        return
      }

      listEl.innerHTML = tracks
        .map((track) => {
          const artist = getArtistName(track)
          const album = getAlbumName(track) || "Single or unknown album"
          const title = track?.name || "Unknown track"
          const trackUrl = track?.url || LASTFM_DASHBOARD_CONFIG.baseUrl
          const cover = pickLargestImage(track?.image)
          const timestamp = getTrackTimestamp(track)
          const isNowPlaying = track?.["@attr"]?.nowplaying === "true"
          const timeLabel = isNowPlaying ? "Now playing" : formatRelativeTime(timestamp)

          return [
            '<li class="lfm-recent-item">',
            '<div class="lfm-cover-shell lfm-cover-shell-inline">',
            cover
              ? '<img class="lfm-cover is-visible" src="' +
                cover +
                '" alt="' +
                (artist + " - " + title).replace(/"/g, "&quot;") +
                '" loading="lazy" referrerpolicy="no-referrer">'
              : "",
            '<div class="lfm-cover-fallback' + (cover ? " is-hidden" : "") + '" aria-hidden="true">♫</div>',
            "</div>",
            '<div class="lfm-item-copy lfm-recent-title-copy">',
            '<a class="lfm-row-link" href="' +
              trackUrl +
              '" target="_blank" rel="noopener noreferrer">' +
              title +
              "</a>",
            '<p class="lfm-item-meta lfm-inline-meta">' + artist + "</p>",
            '<p class="lfm-item-submeta lfm-inline-submeta">' + album + "</p>",
            "</div>",
            '<span class="lfm-row-cell lfm-row-cell-artist">' + artist + "</span>",
            '<span class="lfm-row-cell lfm-row-cell-album">' + album + "</span>",
            '<span class="lfm-playcount">' + timeLabel + "</span>",
            "</li>",
          ].join("")
        })
        .join("")
    }

    function renderRankedList(widget, kind, items) {
      const listEl = widget.querySelector('[data-lfm-top-list="' + kind + '"]')
      if (!listEl) return

      if (!items.length) {
        listEl.innerHTML = '<li class="lfm-empty-state">Nothing available for this period.</li>'
        return
      }

      listEl.innerHTML = items
        .map((item, index) => {
          const title = item?.name || "Unknown"
          const context =
            kind === "artists" ? "Artist" : textOf(item?.artist) || "Unknown artist"
          const url = item?.url || LASTFM_DASHBOARD_CONFIG.baseUrl
          const cover = pickLargestImage(item?.image)
          const fallbackLabel = kind === "artists" ? "ART" : kind === "albums" ? "LP" : "♫"

          return [
            '<li class="lfm-ranked-item">',
            '<div class="lfm-cover-shell lfm-cover-shell-inline">',
            cover
              ? '<img class="lfm-cover is-visible" src="' +
                cover +
                '" alt="' +
                title.replace(/"/g, "&quot;") +
                '" loading="lazy" referrerpolicy="no-referrer">'
              : "",
            '<div class="lfm-cover-fallback' + (cover ? " is-hidden" : "") + '" aria-hidden="true">' +
              fallbackLabel +
              "</div>",
            "</div>",
            '<span class="lfm-rank">#' + (index + 1) + "</span>",
            '<div class="lfm-item-copy lfm-ranked-title-copy">',
            '<a class="lfm-row-link" href="' +
              url +
              '" target="_blank" rel="noopener noreferrer">' +
              title +
              "</a>",
            '<p class="lfm-item-meta lfm-inline-meta">' + context + "</p>",
            "</div>",
            '<span class="lfm-row-cell lfm-row-cell-context">' + context + "</span>",
            '<span class="lfm-playcount">' +
              (item?.playcount ? formatNumber(item.playcount) + " plays" : "No plays") +
              "</span>",
            "</li>",
          ].join("")
        })
        .join("")
    }

    function renderStatsRow(container, stats) {
      if (!container) return
      const pills = stats.filter((entry) => entry && entry.value)
      if (!pills.length) {
        container.innerHTML = ""
        return
      }

      container.innerHTML = pills
        .map((entry) => '<span class="lfm-stat">' + entry.label + ": " + entry.value + "</span>")
        .join("")
    }

    function renderAlbum(widget, albumInfo, track) {
      const titleEl = widget.querySelector("[data-lfm-album-title]")
      const metaEl = widget.querySelector("[data-lfm-album-meta]")
      const summaryEl = widget.querySelector("[data-lfm-album-summary]")
      const tracksEl = widget.querySelector("[data-lfm-album-tracks]")
      const chipEl = widget.querySelector("[data-lfm-album-chip]")
      const linkEl = widget.querySelector("[data-lfm-album-link]")
      const statsEl = widget.querySelector("[data-lfm-album-stats]")
      const albumName = albumInfo?.name || getAlbumName(track)
      const artistName = albumInfo?.artist || getArtistName(track)
      const image = pickLargestImage(albumInfo?.image || track?.image)

      if (!albumName) {
        if (titleEl) titleEl.textContent = "No album data"
        if (metaEl) metaEl.textContent = "The latest scrobble did not include an album name."
        if (summaryEl) summaryEl.textContent = "Nothing to spotlight until a scrobble arrives with album metadata."
        if (tracksEl) tracksEl.innerHTML = '<li class="lfm-empty-state">Album tracklist unavailable.</li>'
        if (chipEl) chipEl.textContent = "Unavailable"
        if (linkEl) linkEl.href = LASTFM_DASHBOARD_CONFIG.baseUrl
        renderStatsRow(statsEl, [])
        setCover(widget, "album", "", "")
        return
      }

      if (titleEl) titleEl.textContent = albumName
      if (metaEl) metaEl.textContent = artistName
      if (summaryEl) {
        summaryEl.textContent =
          stripHtml(albumInfo?.wiki?.summary) ||
          "No album wiki summary available for this release on Last.fm."
      }
      if (chipEl) chipEl.textContent = albumInfo?.userplaycount ? formatNumber(albumInfo.userplaycount) + " plays" : "Recent pick"
      if (linkEl) linkEl.href = albumInfo?.url || track?.url || LASTFM_DASHBOARD_CONFIG.baseUrl

      renderStatsRow(statsEl, [
        { label: "Listeners", value: albumInfo?.listeners ? formatNumber(albumInfo.listeners) : "" },
        { label: "Global plays", value: albumInfo?.playcount ? formatNumber(albumInfo.playcount) : "" },
      ])

      const trackList = Array.isArray(albumInfo?.tracks?.track)
        ? albumInfo.tracks.track
        : albumInfo?.tracks?.track
          ? [albumInfo.tracks.track]
          : []

      if (tracksEl) {
        tracksEl.innerHTML = trackList.length
          ? trackList
              .slice(0, 6)
              .map((albumTrack) => {
                const duration = formatDuration(albumTrack?.duration)
                return (
                  '<li class="lfm-mini-item"><span class="lfm-mini-track">' +
                  (albumTrack?.name || "Unknown track") +
                  '</span><span class="lfm-mini-duration">' +
                  duration +
                  "</span></li>"
                )
              })
              .join("")
          : '<li class="lfm-empty-state">No tracklist available for this album.</li>'
      }

      setCover(widget, "album", image, artistName + " - " + albumName)
    }

    function renderArtist(widget, artistInfo, track) {
      const titleEl = widget.querySelector("[data-lfm-artist-title]")
      const metaEl = widget.querySelector("[data-lfm-artist-meta]")
      const summaryEl = widget.querySelector("[data-lfm-artist-summary]")
      const similarEl = widget.querySelector("[data-lfm-artist-similar]")
      const chipEl = widget.querySelector("[data-lfm-artist-chip]")
      const linkEl = widget.querySelector("[data-lfm-artist-link]")
      const statsEl = widget.querySelector("[data-lfm-artist-stats]")
      const artistName = artistInfo?.name || getArtistName(track)
      const image = pickLargestImage(artistInfo?.image)

      if (titleEl) titleEl.textContent = artistName || "No artist data"
      if (metaEl) {
        const tags = Array.isArray(artistInfo?.tags?.tag) ? artistInfo.tags.tag.slice(0, 3).map((tag) => tag?.name).filter(Boolean) : []
        metaEl.textContent = tags.length ? tags.join(" · ") : "No genre tags available."
      }
      if (summaryEl) {
        summaryEl.textContent =
          stripHtml(artistInfo?.bio?.summary) || "No artist bio available on Last.fm for this artist."
      }
      if (chipEl) {
        chipEl.textContent = artistInfo?.stats?.userplaycount
          ? formatNumber(artistInfo.stats.userplaycount) + " plays"
          : "From latest track"
      }
      if (linkEl) linkEl.href = artistInfo?.url || track?.url || LASTFM_DASHBOARD_CONFIG.baseUrl

      renderStatsRow(statsEl, [
        {
          label: "Listeners",
          value: artistInfo?.stats?.listeners ? formatNumber(artistInfo.stats.listeners) : "",
        },
        {
          label: "Global plays",
          value: artistInfo?.stats?.playcount ? formatNumber(artistInfo.stats.playcount) : "",
        },
      ])

      const similarArtists = Array.isArray(artistInfo?.similar?.artist)
        ? artistInfo.similar.artist.slice(0, 8)
        : []

      if (similarEl) {
        similarEl.innerHTML = similarArtists.length
          ? similarArtists
              .map((artist) => {
                const url = artist?.url || LASTFM_DASHBOARD_CONFIG.baseUrl
                return (
                  '<a class="lfm-pill" href="' +
                  url +
                  '" target="_blank" rel="noopener noreferrer">' +
                  (artist?.name || "Unknown") +
                  "</a>"
                )
              })
              .join("")
          : '<span class="lfm-empty-state">No similar artists listed.</span>'
      }

      setCover(widget, "artist", image, artistName + " artist image")
    }

    async function fetchRecentTracks() {
      const data = await fetchJson(
        buildApiUrl("user.getrecenttracks", {
          limit: LASTFM_DASHBOARD_CONFIG.recentLimit,
          extended: 1,
        }),
      )

      const rawTracks = data?.recenttracks?.track
      return Array.isArray(rawTracks) ? rawTracks : rawTracks ? [rawTracks] : []
    }

    async function fetchTop(period) {
      const [tracksData, albumsData, artistsData] = await Promise.all([
        fetchJson(buildApiUrl("user.gettoptracks", { period, limit: LASTFM_DASHBOARD_CONFIG.topLimit })),
        fetchJson(buildApiUrl("user.gettopalbums", { period, limit: LASTFM_DASHBOARD_CONFIG.topLimit })),
        fetchJson(buildApiUrl("user.gettopartists", { period, limit: LASTFM_DASHBOARD_CONFIG.topLimit })),
      ])

      const rawTracks = Array.isArray(tracksData?.toptracks?.track) ? tracksData.toptracks.track : []
      const rawAlbums = Array.isArray(albumsData?.topalbums?.album) ? albumsData.topalbums.album : []
      const rawArtists = Array.isArray(artistsData?.topartists?.artist) ? artistsData.topartists.artist : []

      const [tracks, artists] = await Promise.all([
        Promise.all(rawTracks.map((item) => enrichTopTrack(item))),
        Promise.all(rawArtists.map((item) => enrichTopArtist(item))),
      ])

      return {
        tracks,
        albums: rawAlbums,
        artists,
      }
    }

    async function fetchSpotlights(track) {
      const artist = getArtistName(track)
      const album = getAlbumName(track)

      const requests = [
        album
          ? fetchJson(
              buildApiUrl("album.getinfo", {
                artist,
                album,
                username: LASTFM_DASHBOARD_CONFIG.username,
                autocorrect: 1,
              }),
            ).catch(() => null)
          : Promise.resolve(null),
        artist
          ? fetchJson(
              buildApiUrl("artist.getinfo", {
                artist,
                username: LASTFM_DASHBOARD_CONFIG.username,
                autocorrect: 1,
              }),
            ).catch(() => null)
          : Promise.resolve(null),
      ]

      const [albumData, artistData] = await Promise.all(requests)

      return {
        album: albumData?.album || null,
        artist: artistData?.artist || null,
      }
    }

    function setActivePeriod(widget, kind, period) {
      widget.querySelectorAll('[data-lfm-period][data-lfm-kind="' + kind + '"]').forEach((button) => {
        button.classList.toggle("is-active", button.getAttribute("data-lfm-period") === period)
      })
    }

    function renderTopError(widget) {
      ;["tracks", "albums", "artists"].forEach((kind) => {
        const listEl = widget.querySelector('[data-lfm-top-list="' + kind + '"]')
        if (listEl) {
          listEl.innerHTML =
            '<li class="lfm-empty-state">Could not load this list from Last.fm right now.</li>'
        }
      })
    }

    async function refreshTop(widget, kind, period) {
      try {
        const topData = await fetchTop(period)
        renderRankedList(widget, kind, topData[kind] || [])
      } catch (_error) {
        const listEl = widget.querySelector('[data-lfm-top-list="' + kind + '"]')
        if (listEl) {
          listEl.innerHTML =
            '<li class="lfm-empty-state">Could not load this list from Last.fm right now.</li>'
        }
      }
    }

    async function refreshDashboard() {
      const widgets = document.querySelectorAll("[data-lastfm-dashboard]")
      if (!widgets.length) return

      try {
        const recentTracks = await fetchRecentTracks()

        widgets.forEach((widget) => {
          renderRecent(widget, recentTracks)
        })

        const focusTrack = recentTracks[0]
        const spotlightData = focusTrack ? await fetchSpotlights(focusTrack) : { album: null, artist: null }

        widgets.forEach((widget) => {
          renderAlbum(widget, spotlightData.album, focusTrack)
          renderArtist(widget, spotlightData.artist, focusTrack)
        })

        await Promise.all(
          Array.from(widgets).flatMap((widget) =>
            ["tracks", "artists", "albums"].map((kind) => {
              const period = widget.getAttribute("data-lfm-period-" + kind) || "1month"
              return refreshTop(widget, kind, period)
            }),
          ),
        )
      } catch (_error) {
        widgets.forEach((widget) => {
          const recentList = widget.querySelector("[data-lfm-recent-list]")
          if (recentList) {
            recentList.innerHTML =
              '<li class="lfm-empty-state">Last.fm did not respond. Try again in a moment.</li>'
          }
          renderAlbum(widget, null, null)
          renderArtist(widget, null, null)
          renderTopError(widget)
        })
      } finally {
        widgets.forEach((widget) => {
          widget.setAttribute("data-lfm-hydrated", "true")
        })
      }
    }

    function initWidget(widget) {
      if (widget.getAttribute("data-lfm-ready") === "true") return
      widget.setAttribute("data-lfm-ready", "true")
      ;["tracks", "artists", "albums"].forEach((kind) => {
        widget.setAttribute("data-lfm-period-" + kind, "1month")
        setActivePeriod(widget, kind, "1month")
      })

      widget.querySelectorAll("[data-lfm-period]").forEach((button) => {
        button.addEventListener("click", async () => {
          const period = button.getAttribute("data-lfm-period") || "1month"
          const kind = button.getAttribute("data-lfm-kind") || "tracks"
          widget.setAttribute("data-lfm-period-" + kind, period)
          setActivePeriod(widget, kind, period)
          await refreshTop(widget, kind, period)
        })
      })
    }

    function setupWidgets() {
      document.querySelectorAll("[data-lastfm-dashboard]").forEach((widget) => {
        initWidget(widget)
      })
      refreshDashboard()
    }

    document.addEventListener("nav", setupWidgets)
    addCleanup(() => {
      document.removeEventListener("nav", setupWidgets)
    })
  `

  return LastFmDashboard
}) satisfies QuartzComponentConstructor<LastFmDashboardOptions>

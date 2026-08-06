import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  // If baseUrl contains a pathname after the domain, use this as the home link
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname
  const staticBaseDir = baseDir.replace(/\/$/, "")

  return (
    <article class="popover-hint">
      <img src={`${staticBaseDir}/Attachments/the-raven.png`} alt="The Raven" class="not-found-img" />
      <pre class="not-found-poem">{`Once upon a midnight dreary, while I websurfed, weak and weary,

Over many a strange and spurious website of 'hot chicks galore',

While I clicked my fav'rite bookmark, suddenly there came a warning,

And my heart was filled with mourning, mourning for my dear amour.

"'Tis not possible," I muttered, "give me back my cheap hardcore!" -

Quoth the server, "404".`}</pre>
      <a href={baseDir}>{i18n(cfg.locale).pages.error.home}</a>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor

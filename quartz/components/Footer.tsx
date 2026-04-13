import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { concatenateResources } from "../util/resources"
import style from "./styles/footer.scss"

const internetButtons = [
  { src: "/static/internet-buttons/128.gif", alt: "128" },
  { src: "/static/internet-buttons/49.gif", alt: "49" },
  { src: "/static/internet-buttons/anticodeandrun.gif", alt: "code and run" },
  { src: "/static/internet-buttons/code88x31_1.gif", alt: "code" },
  { src: "/static/internet-buttons/dark-mode.gif", alt: "dark mode" },
  { src: "/static/internet-buttons/fingerofgod.gif", alt: "finger of god" },
  { src: "/static/internet-buttons/gnu-linux.gif", alt: "gnu linux" },
  { src: "/static/internet-buttons/handpainted.gif", alt: "hand painted" },
  { src: "/static/internet-buttons/hicolor.gif", alt: "hicolor" },
  { src: "/static/internet-buttons/itoddler.gif", alt: "itoddler" },
  { src: "/static/internet-buttons/menmy.gif", alt: "menmy" },
  { src: "/static/internet-buttons/mymusic.gif", alt: "my music" },
  { src: "/static/internet-buttons/rss-button.gif", alt: "rss" },
  { src: "/static/internet-buttons/spiritcellar_badge.gif", alt: "spirit cellar" },
  { src: "/static/internet-buttons/starlocked.gif", alt: "starlocked" },
  { src: "/static/internet-buttons/strawberry.gif", alt: "strawberry" },
  { src: "/static/internet-buttons/theoldnet_but.gif", alt: "the old net" },
  { src: "/static/internet-buttons/y2k.gif", alt: "y2k" },
]

interface Options {
  links: Record<string, string>
  components?: QuartzComponent[]
}

export default ((opts?: Options) => {
  const components = opts?.components ?? []

  const Footer: QuartzComponent = (props: QuartzComponentProps) => {
    const { displayClass } = props
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <ul class="footer-links">
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
        <div class="internet-buttons">
          {internetButtons.map((btn) => (
            <img src={btn.src} alt={btn.alt} loading="lazy" />
          ))}
        </div>
        {components.map((Component) => (
          <Component {...props} />
        ))}
      </footer>
    )
  }

  Footer.css = concatenateResources(style, ...components.map((component) => component.css))
  Footer.beforeDOMLoaded = concatenateResources(
    ...components.map((component) => component.beforeDOMLoaded),
  )
  Footer.afterDOMLoaded = concatenateResources(
    ...components.map((component) => component.afterDOMLoaded),
  )
  return Footer
}) satisfies QuartzComponentConstructor<Options | undefined>

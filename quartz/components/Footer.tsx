import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { concatenateResources } from "../util/resources"
import style from "./styles/footer.scss"

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
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
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

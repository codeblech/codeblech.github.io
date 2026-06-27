import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const lastFmConfig = {
  username: "yashmalik",
  apiKey: "923933ce9c5a4e64c1221a53054046cf",
  // useLibreFm: true,
}

const nowPlaying = Component.NowPlaying(lastFmConfig)
const lastFmDashboard = Component.LastFmDashboard(lastFmConfig)

const nowPlayingOnMusic = Component.ConditionalRender({
  component: nowPlaying,
  condition: (page) => page.fileData.slug === "music",
})

const lastFmDashboardOnMusic = Component.ConditionalRender({
  component: lastFmDashboard,
  condition: (page) => page.fileData.slug === "music",
})

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [nowPlayingOnMusic, lastFmDashboardOnMusic],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/codeblech",
      Twitter: "https://x.com/codeblech",
      Bluesky: "https://bsky.app/profile/codeblech.bsky.social",
      RSS: "https://yashmalik.in/index.xml",
      Resume: "https://yashmalik.in/My-Resume",
      Music: "/music",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // Component.ConditionalRender({
    // component: Component.Breadcrumbs(),
    // condition: (page) => page.fileData.slug !== "index",
    // }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    // Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}

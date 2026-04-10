## Leaves

This project uses the `#dappled-light` layer in [custom.scss](/home/malik/Documents/Programming/quartz-obsidian/quartz/quartz/styles/custom.scss) to simulate sunlight filtered through leaves and window blinds.

How it works:

- The effect starts in [renderPage.tsx](/home/malik/Documents/Programming/quartz-obsidian/quartz/quartz/components/renderPage.tsx), where `DappledLight()` injects a fixed, full-page background layer before the main site content.
- The overall light color is animated by the `sunrise` and `sunset` keyframes. The scene moves through `--night`, `--dawn`, `--morning`, `--day`, `--evening`, and `--dusk`.
- `#leaves` draws a large textured silhouette using [leaves.png](/home/malik/Documents/Programming/quartz-obsidian/quartz/quartz/static/leaves.png). That texture is what creates the irregular leafy shadow pattern.
- `#blinds` builds the straight window-slit shadows using solid horizontal shutters and vertical bars, all colored with `--shadow`.
- `#progressive-blur` stacks multiple fullscreen blur layers with a gradient mask. This makes one part of the shadow pattern crisp and another part softer, which is what gives the effect depth.
- `#glow` and `#glow-bounce` add reflected light. These layers strongly affect whether the scene feels cool and crisp or warm and hazy.
- `.perspective` applies a 3D skew to the lighting rig so the whole effect feels angled rather than flat.
- `#leaves` also runs the `billow` animation, which adds a subtle drifting motion to the leaf shadows.

How to tweak it:

- Change `--bounce-light` if the light side of the page feels too warm or too washed out.
  Cooler, near-white values make the shadows feel sharper.
  Warmer values make the shadows feel softer.
- Change `--shadow` if you want stronger or lighter shadow silhouettes.
- Change the blur amounts in `#progressive-blur` if you want the leaf and blind shadows to stay sharper across more of the screen.
  Lower blur means a crisper effect.
  Higher blur means a softer effect.
- Change the `mask-image: linear-gradient(...)` stops in `#progressive-blur` to decide where the crisp region transitions into the soft region.
- Change `.perspective` `opacity` if the effect feels too faint or too dominant.
- Change the `matrix3d(...)` transform in `.perspective` if you want the light to fall at a different angle.
- Change the size and placement of `#leaves` if you want the foliage pattern to feel larger, smaller, closer, or farther away.
- Replace [leaves.png](/home/malik/Documents/Programming/quartz-obsidian/quartz/quartz/static/leaves.png) if you want a different leaf silhouette entirely.
- Change `.shutter` height, `.shutters` gap, and `.vertical > .bar` width to alter the thickness and spacing of the window-slit shadows.
- Change the `billow` keyframes to make the leaf shadows calmer or more animated.
- Change `lightgray` in [quartz.config.ts](/home/malik/Documents/Programming/quartz-obsidian/quartz/quartz.config.ts) if the surrounding light-mode UI feels too beige, too gray, or too cool.

Current values that matter for the look:

- `lightgray: "#e1daca"` keeps the light theme cleaner than the older `#d1caba`.
- `--bounce-light: #fffffc` keeps the reflected light cooler and makes the leaf and window shadows read more sharply than the older `#f5d7a6`.

# Mesha — Advanced Mesh Gradient Editor

A browser-based mesh gradient editor in the spirit of professional
design tools: a centered artboard in a dark workspace, a true editable
mesh lattice with bezier handles, a preset rail, and one-click export to
images, video and code. Built from scratch with Next.js 15, React 19,
TypeScript, Three.js / React Three Fiber, custom GLSL, Zustand and
Framer Motion.

The surface is a grid of **bicubic Hermite patches**: every lattice node
carries a position, editable tangent handles and a color, and colors are
interpolated across the warped geometry in a selectable color space — so
bending the mesh bends the color field with it.

## Features

- **True mesh lattice** — default 3×3 grid, switchable to 4×4 / 5×5 or
  grown line-by-line up to 12×12 (`Add Line ▾` in the toolbar, like
  inserting a row/column of control points).
- **Bezier handles** — select any point and pull its four handles to
  curve the gradient flow; double-click a handle to restore smooth
  (Catmull-Rom) tangents.
- **Color interpolation** — RGB, Linear RGB, **OKLab** or **LCH**
  (CIELAB). Perceptual spaces kill the muddy browns between
  complementary colors.
- **Topologies** — Rectangle and Circle mesh layouts.
- **Live animation** — organic per-node drift with playback controls
  (play / pause / reverse / speed), cursor attract/repel physics, all
  spring-smoothed.
- **Effects rack** — film grain (intensity + size), progressive blur
  (directional ramp), chromatic aberration, glass distortion, glow,
  vignette, pixelate, posterize, and color correction
  (saturation/contrast/brightness).
- **Pattern overlays** — 11 shader-drawn geometric backdrops (grid, dots,
  dot-grid, horizontal/vertical/diagonal lines, crosses, checker, waves,
  rings, honeycomb) with adjustable scale, opacity, thickness and color.
- **Backdrop glows** — up to four positioned radial lights for clean
  corner/edge "spotlight" backdrops, each with a 9-anchor placement grid,
  radius, intensity and color.
- **Preset rail** — a sidebar gallery of 100 presets across 21 categories,
  thumbnails rasterized from the actual mesh data (including patterns and
  glows).
- **Unbounded undo/redo** — one gesture (drag, handle pull, scrub) is
  one history step.
- **Export** — PNG / JPG / WebP at any resolution up to 8192px
  (4000×3000 default) via an exact offscreen re-render, WebM video
  recorded from the live artboard, CSS / Tailwind / React / SVG / HTML
  code, and **.mesha project files** that re-import for further editing.
- **Accessible** — keyboard-operable mesh points, ARIA labels, visible
  focus rings, `prefers-reduced-motion` and `prefers-contrast` honored.

## Installation

Requires **Node.js 18.18+** (Node 20+ recommended) and pnpm, npm or yarn.

```bash
pnpm install     # or: npm install / yarn
pnpm dev         # start the dev server → http://localhost:3000
```

Production:

```bash
pnpm build       # optimized production build
pnpm start       # serve the build
pnpm lint        # ESLint
npx tsc --noEmit # strict type-check
```

## Keyboard shortcuts

| Keys | Action |
| --- | --- |
| `V` | Move tool (default) |
| `A` / `⇧A` | Add vertical / horizontal line |
| `Space` | Play / pause |
| `⌘Z` / `⌘⇧Z` | Undo / redo |
| `R` | Randomize gradient |
| `←→↑↓` | Nudge focused point (`⇧` for large steps) |
| `⌫` | Reset focused point |
| `H` | Show / hide wireframe |
| `P` / `I` / `E` | Presets / Inspector / Export |
| `T` | Toggle theme |
| `?` | Shortcut reference |

## Architecture

```
app/          Next.js App Router shell (layout, page, design tokens)
components/
  canvas/     artboard (two-pass WebGL pipeline), mesh overlay
              (wireframe + node + bezier handles)
  layout/     top toolbar (tools, actions), playback bar
  panels/     inspector + sections, preset rail
  dialogs/    export hub, shortcuts reference
  ui/         glass panel, buttons, sliders, switches, segmented,
              color field, dialog, magnetic wrapper, icons
shaders/      mesh pass (vertex colors → display sRGB) and post pass
              (effects chain + pattern overlays + backdrop glows) GLSL
lib/          color science (OKLab/CIELAB), noise, mesh math
              (Hermite surface, lattice ops, thumbnails),
              animation engine, presets, export system
store/        Zustand stores (mesh doc + history, UI state)
hooks/        keyboard shortcuts
types/        domain types (MeshDoc and friends)
docs/         deployment, optimization and testing guides
```

### How rendering works

1. The **document** (`MeshDoc`) is a plain serializable object in a
   Zustand store — a rows×cols lattice of nodes (position, color,
   optional tangents), plus canvas, animation and effects settings.
2. The **engine** (`lib/engine.ts`) is a singleton outside React. Each
   frame it advances the clock, computes each node's drift target and
   cursor physics, and relaxes rendered positions with critically-damped
   smoothing into a shared `Float32Array`.
3. The **surface evaluator** (`lib/mesh.ts`) turns the lattice into a
   grid of bicubic Hermite patches — positions *and* colors — writing a
   few thousand vertices straight into WebGL buffer attributes.
4. **Pass 1** renders the vertex-colored mesh into an artboard-sized
   render target (overhanging geometry clips for free); the fragment
   shader converts the interpolated blend-space color to display sRGB.
   **Pass 2** applies the effects chain to that texture.
5. The **overlay** (wireframe, node handles, bezier handles) is DOM/SVG
   positioned by a rAF loop reading the same engine buffers — the chrome
   traces exactly what the GPU draws, and React never re-renders during
   playback.
6. **Export** re-runs the same two-pass pipeline on an offscreen
   renderer at export-grade subdivision, so a 4000×3000 file matches the
   artboard pixel-for-pixel.

### Undo/redo model

`commit()` snapshots the document *before* a discrete change. Continuous
gestures (drags, scrubs) commit once at gesture start and then stream
updates — one gesture, one undo step. History is unbounded.

## Stack notes

- **Framer Motion** is the single UI animation engine (springs, layout
  pills, presence). GSAP / Motion One / React Spring would duplicate it,
  so they were deliberately left out to keep the bundle lean.
- **Leva** was skipped in favor of a custom inspector that matches the
  design language.
- The WebGL canvas is dynamically imported (`ssr: false`); a CSS
  radial-gradient approximation of the default document paints the first
  frame so there's never a flash before the shader takes over.

## Deployment

The app is a static export (`output: "export"`), so it deploys anywhere.
The one-click path is **Vercel** — import the repo, keep the defaults,
and every push to `main` ships to production with preview URLs on pull
requests. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Vercel,
Cloudflare Pages and custom-domain setup.

## Guides

- [Deployment](docs/DEPLOYMENT.md)
- [Performance & optimization](docs/OPTIMIZATION.md)
- [Testing](docs/TESTING.md)

## License

MIT — design, code and presets are original work.

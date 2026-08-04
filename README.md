# @chirag127/design-system

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Framework-agnostic design tokens, themes, atomic web components, and
accessibility primitives. One package set — a distinct look per site type.

## Packages

| Package | Version | What it does |
|---|---|---|
| [`@chirag127/tokens`](packages/tokens) | ![npm](https://img.shields.io/npm/v/@chirag127/tokens) | CSS custom property contract (`--oz-*`): primitives + 4 identity palettes |
| [`@chirag127/theme`](packages/theme) | ![npm](https://img.shields.io/npm/v/@chirag127/theme) | Full theme stylesheets (reset + tokens + utilities) + light/dark switcher |
| [`@chirag127/atoms`](packages/atoms) | ![npm](https://img.shields.io/npm/v/@chirag127/atoms) | Vanilla custom elements (`oz-button`, `oz-card`, etc.) — no framework needed |
| [`@chirag127/a11y`](packages/a11y) | ![npm](https://img.shields.io/npm/v/@chirag127/a11y) | Focus trap, roving tabindex, ARIA helpers — zero dependencies |
| [`@chirag127/react`](packages/react) | ![npm](https://img.shields.io/npm/v/@chirag127/react) | Thin React wrappers over atoms; re-exports a11y utils |
| [`@chirag127/astro`](packages/astro) | ![npm](https://img.shields.io/npm/v/@chirag127/astro) | Astro integration + `.astro` component wrappers |

## Identities (four distinct looks, one component set)

| Identity | For | Accent | Display font |
|---|---|---|---|
| `editorial` | Blogs, long-form, magazines | International Orange | Source Serif 4 |
| `marketing` | SaaS landing pages | Violet-Indigo | Inter Tight |
| `dashboard` | Apps, analytics | Blue | Inter |
| `docs` | Documentation sites | Teal | Inter |

Same markup, completely different look. Swap the theme CSS — atoms follow.

## Quick start

### Plain HTML

```html
<!-- 1. Load a theme -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@chirag127/theme/src/editorial.css" />
<!-- 2. Load atom styles -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@chirag127/atoms/src/styles.css" />
<!-- 3. Register custom elements -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@chirag127/atoms/src/index.js"></script>

<oz-button variant="primary">Hello</oz-button>
```

### npm install

```sh
npm i @chirag127/tokens @chirag127/theme @chirag127/atoms
```

```css
/* In your global CSS */
@import '@chirag127/theme/editorial.css';
@import '@chirag127/atoms/styles.css';
```

```js
import '@chirag127/atoms'
```

### Astro

```sh
npm i @chirag127/astro
```

```js
// astro.config.mjs
import oz from '@chirag127/astro'
export default defineConfig({ integrations: [oz({ identity: 'editorial' })] })
```

### Next.js / React

```tsx
// app/layout.tsx
import '@chirag127/theme/marketing.css'
import '@chirag127/atoms/styles.css'
import '@chirag127/atoms'
```

```tsx
import { Button, Card } from '@chirag127/react'
<Button variant="primary">Ship it</Button>
```

### Vue / Svelte / plain HTML

```html
<link rel="stylesheet" href="@chirag127/theme/dashboard.css" />
<link rel="stylesheet" href="@chirag127/atoms/styles.css" />
<script type="module" src="@chirag127/atoms/index.js"></script>

<oz-button variant="primary">Action</oz-button>
```

## Light / dark

```html
<script type="module" src="@chirag127/theme/theme.js"></script>
<button onclick="ozTheme.cycle()">Toggle theme</button>
```

`window.ozTheme` = `{ get(), set('light'|'dark'|'auto'), cycle(), apply() }`.
Persists to `localStorage`. `data-oz-theme` on `<html>` forces a mode.

## Token contract

Every component and custom style reads the same `--oz-*` variables. Provide
your own identity by setting these:

```css
:root {
  /* required semantic vars */
  --oz-paper: …;  --oz-paper-2: …;  --oz-ink: …;  --oz-ink-mute: …;
  --oz-rule: …;   --oz-accent: …;   --oz-accent-soft: …; --oz-accent-fg: …;
  --oz-success: …; --oz-danger: …;
  --oz-font-display: …; --oz-font-body: …; --oz-font-mono: …;
}
```

Primitives (spacing, type scale, radii, motion) are shared across all identities
and live in `@chirag127/tokens/primitives.css`.

## Accessibility

The `@chirag127/a11y` package ships a focus trap, roving tabindex, and ARIA
utilities — all framework-agnostic, composable, and usable standalone.

## Dev setup

```sh
pnpm install          # installs all packages + demo app
pnpm run build        # builds @chirag127/a11y, @chirag127/react, @chirag127/astro
pnpm run demo:dev     # launches the Astro demo at localhost:4321
pnpm run lint         # biome check
```

## Publishing

See [`.github/workflows/release.yml`](.github/workflows/release.yml). Push a
tag `v*` to trigger — publishes all 6 packages to npm (with provenance) + GitHub
Packages.

```sh
# Manual publish (requires NPM_TOKEN):
git tag v0.1.0 && git push origin v0.1.0
```

## License

MIT — [chirag127](https://github.com/chirag127)

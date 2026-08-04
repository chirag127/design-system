# @chirag127/react

Thin React wrappers over `@chirag127/atoms` web components. Typed — zero extra runtime beyond the custom elements themselves. Peer-deps `react` only.

This is the **React adapter**. The UI is `@chirag127/atoms` — framework-agnostic custom elements styled entirely from the `--oz-*` token contract. The same elements run under any framework; this package just gives React a typed component surface (`<Button>` → `<oz-button>`).

## Install

```sh
npm i @chirag127/react @chirag127/atoms @chirag127/theme @chirag127/tokens
```

## Setup

Import styles + register atoms once (e.g. `app/layout.tsx` in Next.js):

```tsx
import '@chirag127/theme/editorial.css'    // pick your identity
import '@chirag127/atoms/styles.css'
import '@chirag127/atoms'                  // registers custom elements
```

## Components

```tsx
import { Button, Card, Chip, Badge, NavLink, Field, Kicker, Prose, Divider } from '@chirag127/react'

<Button variant="primary" href="/signup">Get started</Button>
<Button variant="secondary" size="sm">Learn more</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger">Delete</Button>

<Card hoverable>
  <Kicker>tutorial</Kicker>
  <h3>Deploy to the edge</h3>
</Card>

<Chip tone="accent">#astro</Chip>
<Badge tone="success">12</Badge>
<Badge tone="danger">3</Badge>

<NavLink active href="/">Overview</NavLink>

<Field>
  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
</Field>

<Prose>
  <p>Long-form content in the theme voice.</p>
</Prose>
```

## Themes

Swap the identity by changing the import:

```tsx
import '@chirag127/theme/marketing.css'   // bold SaaS
import '@chirag127/theme/dashboard.css'   // data-dense app
import '@chirag127/theme/docs.css'        // documentation
```

All components rerender with the new identity — zero markup changes.

## Theme distinctly per site

Tokens are a **contract** (`--oz-*` CSS vars); this package carries **no fixed brand look**. Each site owns its identity: pick a `@chirag127/theme` archetype, then override any `--oz-*` var in your own stylesheet.

```css
/* your site's app.css — loaded after the theme import */
:root {
  --oz-accent: #e8543f;        /* your brand accent */
  --oz-font-display: 'Fraunces', serif;
  --oz-radius: 2px;            /* sharp, not rounded */
}
```

Two sites importing the same theme still look different once they set their own vars. Never copy another site's overrides — every site themes on top of the shared contract.

## Framework-agnostic (Astro / Next / Vue / plain HTML)

The atoms are plain custom elements — no React required. Use this package only where you write JSX; elsewhere author the `oz-*` tags directly.

**Next.js (this package):**

```tsx
import { Button } from '@chirag127/react'
export default () => <Button variant="primary">Go</Button>
```

**Astro** — use `@chirag127/astro` components, or drop the elements inline:

```astro
---
import '@chirag127/atoms/styles.css'
---
<oz-button variant="primary">Go</oz-button>
<script>import '@chirag127/atoms'</script>
```

**Vue** — treat `oz-*` as custom elements (`compilerOptions.isCustomElement`), then:

```vue
<template><oz-button variant="primary">Go</oz-button></template>
<script setup>import '@chirag127/atoms'</script>
```

**Plain HTML:**

```html
<link rel="stylesheet" href="/node_modules/@chirag127/theme/editorial.css">
<link rel="stylesheet" href="/node_modules/@chirag127/atoms/src/styles.css">
<oz-button variant="primary">Go</oz-button>
<script type="module">import '@chirag127/atoms'</script>
```

## A11y helpers

Framework-agnostic primitives re-exported from `@chirag127/a11y` for convenience:

```tsx
import { createFocusTrap, createRover, setAria, announce, createToggle } from '@chirag127/react'
```

## Light/dark

```tsx
// Inline in layout (runs before first paint):
import '@chirag127/theme/theme.js'
// Then: window.ozTheme.set('dark') | window.ozTheme.cycle()
```

# @chirag127/astro

Astro integration + typed `.astro` components for the `@chirag127` design system.

## Install

```sh
npm i @chirag127/astro @chirag127/atoms @chirag127/theme @chirag127/tokens
```

## Integration (auto-inject tokens + atoms)

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import oz from '@chirag127/astro'

export default defineConfig({
  integrations: [oz({ identity: 'editorial' })]
})
```

Options: `identity` — `'editorial' | 'marketing' | 'dashboard' | 'docs'` (default `'editorial'`).

## Components

Import `.astro` components directly:

```astro
---
import OzButton from '@chirag127/astro/components/OzButton.astro'
import OzCard   from '@chirag127/astro/components/OzCard.astro'
import OzChip   from '@chirag127/astro/components/OzChip.astro'
import OzBadge  from '@chirag127/astro/components/OzBadge.astro'
import OzProse  from '@chirag127/astro/components/OzProse.astro'
import OzField  from '@chirag127/astro/components/OzField.astro'
---

<OzButton variant="primary" href="/signup">Get started</OzButton>

<OzCard hoverable>
  <h3>Deploy to the edge</h3>
</OzCard>

<OzChip tone="accent">#astro</OzChip>
<OzBadge tone="success">12</OzBadge>

<OzProse>
  <p>Long-form content.</p>
</OzProse>
```

## Manual (no integration)

```astro
---
// In your layout
import '@chirag127/tokens/primitives.css'
import '@chirag127/tokens/editorial.css'
import '@chirag127/atoms/styles.css'
---
<script>
  import '@chirag127/atoms'
  import '@chirag127/theme/theme.js'
</script>
```

## Themes

Change identity in `astro.config.mjs`:

```js
oz({ identity: 'marketing' })  // bold SaaS
oz({ identity: 'dashboard' })  // data-dense app
oz({ identity: 'docs' })       // documentation
```

## Theme distinctly per site

Tokens are a CONTRACT: every atom + your own CSS reads `--oz-*` CSS vars. This
package ships NO fixed brand look. Pick a base identity, then override the
`--oz-*` vars in your own layout so each site is visually distinct:

```astro
---
import '@chirag127/tokens/primitives.css'
import '@chirag127/tokens/editorial.css'
---
<style is:global>
  :root {
    --oz-color-accent: #7c3aed;   /* this site's signature */
    --oz-font-display: 'Fraunces', serif;
    --oz-radius-lg: 1.25rem;
  }
</style>
```

Same atoms, different site — never the same look twice.

## Framework-agnostic core

The Astro layer is a thin adapter. The tokens, theme, and atoms it injects are
framework-agnostic and work anywhere:

- **Next.js / React** — use `@chirag127/react` wrappers, or import
  `@chirag127/atoms` + a token CSS file directly.
- **Vue / Svelte / SolidJS** — import `@chirag127/atoms` (custom elements) +
  `@chirag127/tokens/<identity>.css`; the `<oz-*>` elements render natively.
- **Plain HTML** — link the token CSS + `@chirag127/atoms/styles.css`, add
  `<script type="module">import '@chirag127/atoms'</script>`, then use `<oz-button>` etc.

Only the auto-inject integration is Astro-specific; the visual contract is portable.


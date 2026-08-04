# @chirag127/tokens

Framework-agnostic design tokens. Shared primitives (spacing, type scale, radii,
motion) plus **per-archetype identity palettes** so every site type gets its own
distinct look from one package set.

| Identity | For | Vibe |
|---|---|---|
| `editorial` | blogs, long-form, magazines | ink-paper + international-orange + serif display |
| `marketing` | SaaS landing pages | white + violet + tight grotesk |
| `dashboard` | apps, analytics | neutral + blue + compact mono numerals |
| `docs` | documentation sites | white + teal + code-forward |

## Install

```sh
pnpm add @chirag127/tokens   # or npm / yarn
```

## Use (any framework — pure CSS)

Load the primitives (package root) once, then exactly one identity on top.

**Plain HTML**

```html
<link rel="stylesheet" href="node_modules/@chirag127/tokens" />
<link rel="stylesheet" href="node_modules/@chirag127/tokens/editorial.css" />
```

**CSS `@import`** (any bundler — Vite, webpack, Parcel)

```css
@import '@chirag127/tokens';
@import '@chirag127/tokens/editorial.css';
```

**Astro** — import in the layout frontmatter or a global stylesheet:

```astro
---
import '@chirag127/tokens';
import '@chirag127/tokens/editorial.css';
---
```

**Next.js** — import once in `app/layout.tsx` (or `pages/_app.tsx`):

```tsx
import '@chirag127/tokens';
import '@chirag127/tokens/dashboard.css';
```

**Vue / Nuxt / Svelte** — import in the root component or entry:

```ts
import '@chirag127/tokens';
import '@chirag127/tokens/marketing.css';
```

Dark mode is automatic via `prefers-color-scheme`; force it with
`data-oz-theme="light" | "dark"` on `<html>`.

## Exports

| Import | Contents |
|---|---|
| `@chirag127/tokens` | primitives — spacing, type scale, radii, motion, layout, z, breakpoints |
| `@chirag127/tokens/primitives.css` | same as root (explicit alias) |
| `@chirag127/tokens/base.css` | optional modern reset + base element styles (reads the contract vars) |
| `@chirag127/tokens/editorial.css` | editorial identity |
| `@chirag127/tokens/marketing.css` | marketing identity |
| `@chirag127/tokens/dashboard.css` | dashboard identity |
| `@chirag127/tokens/docs.css` | docs identity |

Primitives carry **no color or fonts** — load one identity for those. `base.css`
is optional; skip it if your app or framework already ships a reset.

## Semantic contract

Every identity sets the same variables, so components written against the
contract work under any identity:

`--oz-paper --oz-paper-2 --oz-ink --oz-ink-mute --oz-rule --oz-accent
--oz-accent-soft --oz-accent-fg --oz-success --oz-danger
--oz-font-display --oz-font-body --oz-font-mono`

Plus primitives: `--oz-space-* --oz-text-* --oz-radius-* --oz-dur-* --oz-ease-*
--oz-container --oz-container-narrow --oz-header-h --oz-z-* --oz-bp-*`

## Theme distinctly per site

Tokens are a **contract**, not a look. The primitives (spacing, type scale,
radii, motion) stay identical everywhere so rhythm is consistent; the identity
supplies color + font roles, which is what gives each site its own personality.
Two ways to make a site look unlike every other:

1. **Pick a different bundled identity** — an editorial blog and a dashboard app
   already diverge sharply (serif vs. sans, orange vs. blue).
2. **Ship your own identity** — write CSS that sets the full contract below and
   load it *instead of* a bundled one. Nothing else (theme, atoms) changes.

```css
/* my-site.css — a bespoke identity, loaded after the primitives */
:root,
:root[data-oz-theme='light'] {
	color-scheme: light;
	--oz-paper: #fffdf7;
	--oz-paper-2: #f4efe1;
	--oz-ink: #1b1a17;
	--oz-ink-mute: #6b6459;
	--oz-rule: #e3dccb;
	--oz-accent: #b8410f;
	--oz-accent-soft: #f6e6da;
	--oz-accent-fg: #fffdf7;
	--oz-success: #3f7d3f;
	--oz-danger: #b4241a;
	--oz-font-display: 'Fraunces', Georgia, serif;
	--oz-font-body: 'Newsreader', Georgia, serif;
	--oz-font-mono: 'IBM Plex Mono', ui-monospace, monospace;
}
/* add the @media (prefers-color-scheme: dark) + [data-oz-theme='dark'] blocks too */
```

```css
@import '@chirag127/tokens'; /* primitives (spacing, type, motion) */
@import './my-site.css';     /* your identity — overrides nothing but color/fonts */
```

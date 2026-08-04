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

## Use (any framework — pure CSS)

```html
<link rel="stylesheet" href="node_modules/@chirag127/tokens" />
<link rel="stylesheet" href="node_modules/@chirag127/tokens/editorial.css" />
```

Or import in CSS:

```css
@import '@chirag127/tokens';
@import '@chirag127/tokens/editorial.css';
```

Dark mode is automatic via `prefers-color-scheme`; force it with
`data-oz-theme="light" | "dark"` on `<html>`.

## Semantic contract

Every identity sets the same variables, so components written against the
contract work under any identity:

`--oz-paper --oz-paper-2 --oz-ink --oz-ink-mute --oz-rule --oz-accent
--oz-accent-soft --oz-accent-fg --oz-success --oz-danger
--oz-font-display --oz-font-body --oz-font-mono`

Plus primitives: `--oz-space-* --oz-text-* --oz-radius-* --oz-dur-* --oz-ease-*
--oz-container --oz-container-narrow --oz-header-h --oz-z-* --oz-bp-*`

## Custom identity

Write your own CSS setting the contract variables above. Load it instead of a
bundled identity — everything else (theme, atoms) follows.

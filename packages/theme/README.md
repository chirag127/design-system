# @chirag127/theme

Ready-to-use, framework-agnostic themes on top of [`@chirag127/tokens`](../tokens).
One stylesheet per site archetype — load the file that matches what you're
building and the entire page (including `@chirag127/atoms`) takes that look.

| Theme | For | `link` href |
|---|---|---|
| `editorial` | blogs, long-form, magazines | `@chirag127/theme/editorial.css` |
| `marketing` | SaaS landing pages | `@chirag127/theme/marketing.css` |
| `dashboard` | apps, analytics | `@chirag127/theme/dashboard.css` |
| `docs` | documentation sites | `@chirag127/theme/docs.css` |

## Use — plain HTML

```html
<link rel="stylesheet" href="@chirag127/theme/marketing.css" />
```

Any framework that can emit a `<link>` or CSS `@import` works — Astro, Next.js,
React, Vue, Svelte, Rails, WordPress, plain HTML. Zero JS required for theming;
dark mode follows `prefers-color-scheme` or `data-oz-theme` on `<html>`.

## Light / dark

```html
<script type="module" src="@chirag127/theme/theme.js"></script>
<button onclick="ozTheme.cycle()">Theme</button>
```

`window.ozTheme` = `{ get, set, cycle, apply }`, persisted to localStorage.

## The point of four themes

One component set, four distinct identities — so a blog, a landing page, a
dashboard, and a docs site never look like clones of each other. Load the
archetype that fits the job, or write your own identity against the token
contract.

# @chirag127/atoms

Framework-agnostic atomic web components. Vanilla custom elements — **zero
dependencies, works in Astro, Next.js, React, Vue, Svelte, plain HTML, or any
server-rendered site**.

## Why

One component set that restyles itself under each
[`@chirag127/theme`](../theme) archetype — a blog, a landing page, a dashboard,
and a docs site can all use the same `<oz-button>` yet look completely
different, because every rule reads the semantic `--oz-*` tokens.

## Elements

`oz-button` · `oz-chip` · `oz-card` · `oz-badge` · `oz-nav-link` · `oz-divider`
· `oz-kicker` · `oz-field` · `oz-prose`

## Use

```html
<link rel="stylesheet" href="@chirag127/theme/editorial.css" />
<link rel="stylesheet" href="@chirag127/atoms/styles.css" />
<script type="module" src="@chirag127/atoms"></script>

<oz-button variant="primary" href="/read">Read more</oz-button>
<oz-chip tone="accent">#astro</oz-chip>
<oz-card hoverable>…</oz-card>
<oz-nav-link active href="/">Latest</oz-nav-link>
<oz-prose>…article…</oz-prose>
```

## Framework notes

- **Astro / Next.js / plain HTML**: use the tags directly — they're just HTML.
- **React / Preact**: use the tags directly too (custom elements are fine); or
  wrap them in thin React components if you want props-driven usage.
- Elements with an `href` upgrade themselves into real `<a>` elements at
  runtime for correct semantics and middle-click behavior.
- No shadow DOM — style and override them with plain CSS; they inherit your
  page's variables.

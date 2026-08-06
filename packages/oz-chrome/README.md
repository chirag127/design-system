# @chirag127/oz-chrome

Shared Astro chrome for **oriz.in** sites — the wordmark, header, footer, and an accessible tool-page shell in ONE place. Restyle the whole fleet by editing this package. Every site keeps its own palette: all styling reads `--oz-*` tokens.

## Install

```sh
npm i @chirag127/oz-chrome
```

## Use

```astro
---
import OzToolShell from '@chirag127/oz-chrome/components/OzToolShell.astro'
import '@chirag127/oz-chrome/styles.css'
---
<html lang="en">
  <head><meta charset="utf-8" /><title>Cards · oriz.in</title></head>
  <body>
    <OzToolShell site="cards" title="Flashcards">
      <a slot="nav" href="/about">About</a>
      <!-- tool body -->
      <h1>Build a deck</h1>
      <a slot="footer" href="https://oriz.in">More tools</a>
    </OzToolShell>
  </body>
</html>
```

`OzToolShell` renders a skip-link → `<main id="oz-main">` landmark, a `theme-color` meta, plus `OzHeader` + `OzFooter`.

### Props (`ChromeMeta`)

| prop | default | notes |
|---|---|---|
| `site` | — | subdomain slug → `cards.oriz.in` wordmark tail |
| `title` | wordmark | tool title in header |
| `wordmarkHref` | `https://oriz.in` | wordmark link |
| `themeColor` | `var(--oz-accent)` | `theme-color` meta |

Individual pieces available: `@chirag127/oz-chrome/components/OzHeader.astro`, `.../OzFooter.astro`.

## Theme per site

Ships NO fixed look. Override `--oz-*` in your layout and the chrome inherits it:

```css
:root {
  --oz-accent: #7c3aed;
  --oz-font-display: 'Fraunces', serif;
}
```

## Runtime helpers

`resolveChrome(meta)`, `normalizeSite(slug)`, `ORIZ_HOME` — pure, exported from the package root for tests/tooling.

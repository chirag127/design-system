# @chirag127/a11y

Framework-agnostic accessibility primitives. Zero dependencies — works in Astro, Next, Vue, Svelte, or plain HTML.

## Primitives

| Module | What it does |
|---|---|
| `focus-trap` | Lock/release focus within a dialog, drawer, or modal |
| `roving-tabindex` | Arrow-key navigation for toolbars, listboxes, radio groups |
| `aria` | `setAria`, `announce`, `createToggle`, `visuallyHide` helpers |

## Install

```sh
npm i @chirag127/a11y
```

## Usage

```ts
import { createFocusTrap } from '@chirag127/a11y/focus-trap'
import { createRover } from '@chirag127/a11y/roving-tabindex'
import { announce, createToggle } from '@chirag127/a11y/aria'

// Focus trap
const trap = createFocusTrap(document.getElementById('dialog'))
trap.activate()   // locks focus
trap.deactivate() // releases + restores prior focus

// Roving tabindex
const rover = createRover(document.getElementById('toolbar'), { orientation: 'horizontal' })
rover.destroy() // cleanup

// ARIA helpers
announce('Item saved')  // polite live region
const toggle = createToggle(triggerEl, panelEl)
toggle.toggle() // flips aria-expanded + aria-hidden
```

## Framework usage

Works in any framework. Import once at app init, no hydration boundary needed.

### Next.js / React

```ts
import { createFocusTrap } from '@chirag127/a11y/focus-trap'
// Call in useEffect with a ref
```

### Astro

```astro
---
import { announce } from '@chirag127/a11y/aria'
---
<script>
  import { createFocusTrap } from '@chirag127/a11y/focus-trap'
  // ...
</script>
```

### Vue

```ts
import { createFocusTrap } from '@chirag127/a11y/focus-trap'
// Call in onMounted with template ref
```

# @chirag127/oz-tokens-base

The `--oz-*` CSS custom-property **contract** — color roles, space scale, radii, font-family slots, motion durations — with sane defaults and an a11y focus ring. Pure CSS, no JS, zero runtime deps.

Every site imports this for the shared contract, then **overrides** the color roles and font slots with its own bespoke palette and type. Shared mechanism, unique look.

## Install

```sh
pnpm add @chirag127/oz-tokens-base
```

## Use

```html
<link rel="stylesheet" href="@chirag127/oz-tokens-base" />
<link rel="stylesheet" href="/my-site-theme.css" />
```

Or in CSS/JS:

```css
@import "@chirag127/oz-tokens-base";
```

Then give the site its own look by overriding the color roles + font slots (loaded **after** the import):

```css
/* my-site-theme.css */
:root {
	--oz-bg: #fffaf3;
	--oz-fg: #241b12;
	--oz-accent: #d6552b;
	--oz-accent-fg: #fffaf3;
	--oz-font-display: "Fraunces", serif;
	--oz-font-body: "Inter", sans-serif;
}
```

## Contract

Override these:

| Prop | Role |
| --- | --- |
| `--oz-bg` | page background |
| `--oz-fg` | primary text |
| `--oz-surface` | raised panel / card |
| `--oz-muted` | secondary text / icons |
| `--oz-border` | hairlines, dividers, input borders |
| `--oz-accent` | brand / interactive |
| `--oz-accent-fg` | text on `--oz-accent` |
| `--oz-font-display` / `--oz-font-body` / `--oz-font-mono` | font-family slots |

Shared primitives (do **not** override — keep rhythm consistent across sites):
`--oz-space-{1,2,3,4,6,8,12,16}`, `--oz-radius-{s,m,l,full}`, `--oz-dur-{fast,base,slow}`, `--oz-ease-{out,in-out}`.

## Exports

| Specifier | File |
| --- | --- |
| `@chirag127/oz-tokens-base` | contract + base (entry) |
| `@chirag127/oz-tokens-base/contract.css` | contract + defaults only |
| `@chirag127/oz-tokens-base/base.css` | base element styles + focus ring only |

## License

MIT

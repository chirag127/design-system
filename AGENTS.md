# Design-system agent guide

`@chirag127/*` packages share mechanism, never a single visual identity.

- Keep tokens as a contract: CSS custom properties, small composable atoms, and framework-neutral accessibility behavior.
- Themes are archetype starting points, not mandatory site skins. A consuming Astro, Next, Vue, Svelte, or plain HTML site must add its own subject-led palette, typography, layout, motion, and signature.
- Do not make every site look like the demo. The demo proves that identical atoms can take different identities; production sites must still earn their own design.
- Keep packages independently publishable to npm/GitHub, zero-dependency where practical, and usable without a framework.
- Validate package builds and the demo with the repository's pinned pnpm version before release.

import { defineConfig } from 'tsup'

export default defineConfig({
	entry: { index: 'src/index.ts', integration: 'src/integration.ts' },
	format: ['esm'],
	dts: true,
	clean: true,
	external: ['astro'],
})

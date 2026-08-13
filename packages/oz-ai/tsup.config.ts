import { defineConfig } from 'tsup'

export default defineConfig({
	entry: { index: 'src/index.ts' },
	format: ['esm'],
	dts: true,
	clean: true,
	external: ['@gpt4free/g4f.dev'],
	// Bundle the keyless-ai tree into dist so `file:`-consuming sites resolve it
	// without installing the unpublished sibling workspace packages.
	noExternal: [
		'@chirag127/keyless-ai',
		'@chirag127/keyless-kilo',
		'@chirag127/keyless-ovh',
		'@chirag127/keyless-pollinations',
	],
})

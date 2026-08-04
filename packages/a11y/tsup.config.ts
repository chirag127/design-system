import { defineConfig } from 'tsup'

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		'focus-trap': 'src/focus-trap.ts',
		'roving-tabindex': 'src/roving-tabindex.ts',
		aria: 'src/aria.ts',
	},
	format: ['esm'],
	dts: true,
	clean: true,
	sourcemap: false,
	minify: false,
})

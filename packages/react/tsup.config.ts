import { defineConfig } from 'tsup'

export default defineConfig({
	entry: { index: 'src/index.tsx' },
	format: ['esm'],
	dts: true,
	clean: true,
	external: ['react', 'react-dom'],
	esbuildOptions(options) {
		options.jsx = 'automatic'
	},
})

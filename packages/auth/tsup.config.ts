import { defineConfig } from 'tsup'

export default defineConfig({
	entry: { index: 'src/index.ts' },
	format: ['esm'],
	dts: true,
	clean: true,
	external: ['react', 'react-dom', '@clerk/clerk-react'],
	esbuildOptions(options) {
		options.jsx = 'automatic'
	},
})

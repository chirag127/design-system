import { fileURLToPath } from 'node:url'
import { defineConfig } from 'astro/config'

export default defineConfig({
	output: 'static',
	trailingSlash: 'ignore',
	vite: {
		resolve: {
			alias: {
				'~': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
	},
})

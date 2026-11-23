import { defineConfig } from 'vitest/config'

// Package-local config stops Vitest walking up to the parent workspace root.
// Tests live either in test/ or co-located in src/ — cover both.
export default defineConfig({
	test: {
		root: import.meta.dirname,
		environment: 'node',
		include: ['**/*.test.js'],
	},
})

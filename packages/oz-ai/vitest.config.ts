import { defineConfig } from 'vitest/config'

// Package-local config stops Vitest from walking up to the parent workspace
// (C:\g\ws) and picking up an unrelated root vitest.config.ts.
export default defineConfig({
	test: {
		root: __dirname,
		environment: 'node',
		include: ['src/**/*.test.ts'],
	},
})

import { describe, expect, it } from 'vitest'
import { formatBytes } from '../src/format'

describe('formatBytes', () => {
	it('formats bytes under 1 KB', () => {
		expect(formatBytes(0)).toBe('0 B')
		expect(formatBytes(512)).toBe('512 B')
	})

	it('scales to KB/MB/GB', () => {
		expect(formatBytes(1024)).toBe('1 KB')
		expect(formatBytes(1536)).toBe('1.5 KB')
		expect(formatBytes(1048576)).toBe('1 MB')
		expect(formatBytes(1073741824)).toBe('1 GB')
	})

	it('honors decimals', () => {
		expect(formatBytes(1536, 2)).toBe('1.5 KB')
		expect(formatBytes(1592, 2)).toBe('1.55 KB')
	})

	it('handles negatives and non-finite', () => {
		expect(formatBytes(-1024)).toBe('-1 KB')
		expect(formatBytes(Number.NaN)).toBe('—')
		expect(formatBytes(Number.POSITIVE_INFINITY)).toBe('—')
	})
})

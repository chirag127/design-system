/** Format a byte count as a human-readable string (e.g. 1536 → "1.5 KB"). */
export function formatBytes(bytes: number, decimals = 1): string {
	if (!Number.isFinite(bytes)) return '—'
	const neg = bytes < 0
	let n = Math.abs(bytes)
	if (n < 1) return `${neg ? '-' : ''}${n} B`
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
	let i = 0
	while (n >= 1024 && i < units.length - 1) {
		n /= 1024
		i++
	}
	const rounded = i === 0 ? n : Number(n.toFixed(decimals))
	return `${neg ? '-' : ''}${rounded} ${units[i]}`
}

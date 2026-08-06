/** Trigger a browser download of a Blob under the given filename. */
export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	a.rel = 'noopener'
	document.body.appendChild(a)
	a.click()
	a.remove()
	// Revoke on next tick so the download has claimed the URL.
	setTimeout(() => URL.revokeObjectURL(url), 0)
}

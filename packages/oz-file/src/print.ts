/**
 * Print a scoped node to PDF via the browser print dialog.
 *
 * Injects a temporary print stylesheet that hides everything except the target
 * node (and its ancestors), calls window.print(), then cleans up.
 */
export function printToPdf(node?: HTMLElement): void {
	if (!node) {
		window.print()
		return
	}

	node.setAttribute('data-oz-print', 'target')

	const style = document.createElement('style')
	style.setAttribute('data-oz-print-style', '')
	style.textContent = `
		@media print {
			body * { visibility: hidden !important; }
			[data-oz-print="target"], [data-oz-print="target"] * { visibility: visible !important; }
			[data-oz-print="target"] {
				position: absolute !important;
				left: 0 !important;
				top: 0 !important;
				width: 100% !important;
			}
		}
	`
	document.head.appendChild(style)

	const cleanup = () => {
		style.remove()
		node.removeAttribute('data-oz-print')
		window.removeEventListener('afterprint', cleanup)
	}
	window.addEventListener('afterprint', cleanup)
	window.print()
	// Fallback for browsers that don't fire afterprint.
	setTimeout(cleanup, 1000)
}

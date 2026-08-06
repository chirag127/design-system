/** Wire drag-and-drop file handling onto an element. */
export interface DropZoneOptions {
	/** Class toggled on the element while a drag is over it. Default 'oz-dragover'. */
	dragClass?: string
}

/** Attach drop handling; returns a teardown function. */
export function onDropZone(
	el: HTMLElement,
	cb: (files: File[]) => void,
	opts: DropZoneOptions = {},
): () => void {
	const dragClass = opts.dragClass ?? 'oz-dragover'

	const prevent = (e: Event) => {
		e.preventDefault()
		e.stopPropagation()
	}
	const onEnterOver = (e: DragEvent) => {
		prevent(e)
		el.classList.add(dragClass)
	}
	const onLeave = (e: DragEvent) => {
		prevent(e)
		el.classList.remove(dragClass)
	}
	const onDrop = (e: DragEvent) => {
		prevent(e)
		el.classList.remove(dragClass)
		const files = e.dataTransfer ? Array.from(e.dataTransfer.files) : []
		if (files.length) cb(files)
	}

	el.addEventListener('dragenter', onEnterOver)
	el.addEventListener('dragover', onEnterOver)
	el.addEventListener('dragleave', onLeave)
	el.addEventListener('drop', onDrop)

	return () => {
		el.removeEventListener('dragenter', onEnterOver)
		el.removeEventListener('dragover', onEnterOver)
		el.removeEventListener('dragleave', onLeave)
		el.removeEventListener('drop', onDrop)
		el.classList.remove(dragClass)
	}
}

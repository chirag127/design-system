/** Browser FileReader helpers, promisified. */

function read<T>(
	file: Blob,
	method: 'readAsArrayBuffer' | 'readAsDataURL' | 'readAsText',
	encoding?: string,
): Promise<T> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result as T)
		reader.onerror = () => reject(reader.error ?? new Error('read failed'))
		if (method === 'readAsText') reader.readAsText(file, encoding)
		else reader[method](file)
	})
}

/** Read a Blob/File as an ArrayBuffer. */
export function readAsArrayBuffer(file: Blob): Promise<ArrayBuffer> {
	return read<ArrayBuffer>(file, 'readAsArrayBuffer')
}

/** Read a Blob/File as a base64 data URL. */
export function readAsDataURL(file: Blob): Promise<string> {
	return read<string>(file, 'readAsDataURL')
}

/** Read a Blob/File as text (default UTF-8). */
export function readAsText(file: Blob, encoding = 'utf-8'): Promise<string> {
	return read<string>(file, 'readAsText', encoding)
}

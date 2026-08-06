# @chirag127/oz-file

Framework-agnostic browser file helpers. Zero dependencies — works in Astro, Next, Vue, Svelte, or plain HTML.

## API

| Export | What it does |
|---|---|
| `readAsArrayBuffer(file)` | Promise-wrapped `FileReader` → `ArrayBuffer` |
| `readAsDataURL(file)` | Promise-wrapped `FileReader` → base64 data URL |
| `readAsText(file, encoding?)` | Promise-wrapped `FileReader` → text |
| `downloadBlob(blob, filename)` | Trigger a browser download of a `Blob` |
| `onDropZone(el, cb, opts?)` | Wire drag-and-drop; returns teardown fn |
| `printToPdf(node?)` | `window.print()` with a scoped print stylesheet |
| `formatBytes(bytes, decimals?)` | `1536 → "1.5 KB"` |

## Install

```sh
npm i @chirag127/oz-file
```

## Usage

```ts
import {
	readAsText,
	downloadBlob,
	onDropZone,
	printToPdf,
	formatBytes,
} from '@chirag127/oz-file'

// Read a dropped file
const teardown = onDropZone(document.getElementById('drop')!, async (files) => {
	const text = await readAsText(files[0])
	console.log(`${files[0].name} — ${formatBytes(files[0].size)}`)
})

// Download generated output
downloadBlob(new Blob(['hello'], { type: 'text/plain' }), 'note.txt')

// Print just the invoice node to PDF
printToPdf(document.getElementById('invoice')!)

teardown() // remove drop listeners
```

Used by the pdf / img / resume / invoice / md / convert tool sites.

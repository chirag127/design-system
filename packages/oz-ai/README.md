# @chirag127/oz-ai

Single no-key AI client for the fleet. Framework-agnostic TS, zero runtime deps. Wraps Pollinations (`text.pollinations.ai`, OpenAI shape, no API key). Sites never hardcode the endpoint — swap the provider here only.

Built-in: 3s rate-guard, 429/5xx retry-with-backoff, `AbortSignal`, graceful throw so callers can degrade.

## Install

```sh
pnpm add @chirag127/oz-ai
```

## Use

```ts
import { chat, complete, vision, listModels, OzAiError } from '@chirag127/oz-ai'

// one-shot
const answer = await complete('Summarize photosynthesis', {
  system: 'You are terse.',
  model: 'openai',
})

// multi-turn
const reply = await chat([
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Hello' },
])

// vision (data URL or http url)
const desc = await vision('What is in this image?', dataUrl)

// abort
const ac = new AbortController()
const p = complete('long task', { signal: ac.signal })
ac.abort()

// models
const models = await listModels() // string[], [] on failure

// degrade gracefully
try {
  await complete('...')
} catch (e) {
  if (e instanceof OzAiError) render('AI unavailable')
}
```

## API

| Fn | Signature |
|---|---|
| `chat` | `(messages, { model?, signal?, temperature? }) => Promise<string>` |
| `complete` | `(prompt, { system?, model?, signal?, temperature? }) => Promise<string>` |
| `vision` | `(prompt, imageDataUrl, { model?, signal? }) => Promise<string>` |
| `listModels` | `(signal?) => Promise<string[]>` |

Also exports pure helpers `buildPayload`, `buildVisionMessages` and types `Message`, `ContentPart`, `ChatOptions`, `RequestPayload`, and `OzAiError`.

## License

MIT

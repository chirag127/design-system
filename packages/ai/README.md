# @chirag127/ai

One AI interface, two backends. Same `chat(messages, opts) -> Promise<string>` contract both sides.

- **`./server`** — NVIDIA NIM (OpenAI-compatible). Key-safe: reads `NVIDIA_API_KEY` from env. **Server-side only, never ship to client.**
- **`./client`** — Puter.js. Keyless: users auth via Puter, no key leaves the browser. `:free` models only.

Framework-agnostic, zero deps.

## Install

```sh
npm i @chirag127/ai
```

## Server — NVIDIA NIM (key-safe)

Key from env `NVIDIA_API_KEY` (GH Secret). Never embedded, never sent to a browser. Tries 3 models in order.

```js
import { chat } from '@chirag127/ai/server';

// NVIDIA_API_KEY in env (or pass opts.apiKey)
const reply = await chat([{ role: 'user', content: 'Explain HMAC in one line.' }]);
console.log(reply);

// pick a model (still falls back through the rest on error)
await chat('hi', { model: 'meta/llama-3.3-70b-instruct' });
```

Throws if `NVIDIA_API_KEY` is missing. Models tried in order:
`nvidia/llama-3.3-nemotron-super-49b-v1` → `meta/llama-3.3-70b-instruct` → `deepseek-ai/deepseek-r1`.

## Client — Puter.js (keyless)

Loads `js.puter.com/v2` on first call. No key anywhere; the user authorizes via Puter.

```js
import { chat, listFreeModels } from '@chirag127/ai/client';

const reply = await chat('Write a haiku about caching.');
console.log(reply);

// live :free catalog
console.log(await listFreeModels());
```

`:free` models tried in order:
`nvidia/nemotron-3-super-120b-a12b:free` → `openai/gpt-oss-20b:free` → `google/gemma-4-31b-it:free`.

## Shared

```js
import { MODELS, toMessages } from '@chirag127/ai';
MODELS.server; // string[]
MODELS.client; // string[] (:free)
```

Both backends accept a string prompt or a `messages` array (`{ role, content }[]`).

## License

MIT

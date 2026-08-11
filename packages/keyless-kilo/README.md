# @chirag127/keyless-kilo

Keyless [Kilo Gateway](https://kilo.ai) client. OpenAI-compatible chat, **no API key** — rate-limited by IP (~200 req/hr per IP).

Framework-agnostic, zero deps, works in Node + browser via global `fetch`.

## Install

```sh
npm i @chirag127/keyless-kilo
```

## Usage

```js
import { chat, MODELS, DEFAULT_MODEL } from '@chirag127/keyless-kilo';

// string prompt — uses kilo-auto/free (auto-router)
const reply = await chat('Explain HMAC in one line.');

// specific model
await chat(
	[
		{ role: 'system', content: 'You are terse.' },
		{ role: 'user', content: 'hi' },
	],
	{ model: 'nvidia/nemotron-3-ultra-550b-a55b:free' },
);
```

## API

### `chat(messages, opts?) => Promise<string>`

Non-streaming. POSTs `{model, messages}` to `{baseUrl}/chat/completions` — **no auth header**.

| opt | default | note |
|---|---|---|
| `model` | `'kilo-auto/free'` | auto-router; any id from `MODELS` |
| `baseUrl` | `https://api.kilo.ai/api/gateway` | Kilo Gateway |
| `signal` | — | `AbortSignal` |
| ...rest | — | passed through (`temperature`, `max_tokens`, …) |

## Models

Source: OmniRoute `freeModelCatalog.data.ts` — `provider: "kilo-gateway"`, `freeType: "recurring-uncapped"`, `poolKey: "kilo-gateway-free"`. Sorted strongest-first.

| Model | Notes |
|---|---|
| `kilo-auto/free` | **Default** — auto-router, picks best available |
| `nvidia/nemotron-3-ultra-550b-a55b:free` | Nemotron 3 Ultra 550B |
| `nvidia/nemotron-3-super-120b-a12b:free` | Nemotron 3 Super 120B |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | Nemotron 3 Nano Omni (reasoning) |
| `openrouter/auto-beta` | OpenRouter auto (beta) |
| `openrouter/free` | OpenRouter free models router |
| `poolside/laguna-m.1:free` | Poolside Laguna M.1 |
| `poolside/laguna-xs-2.1:free` | Poolside Laguna XS 2.1 |
| `cohere/north-mini-code:free` | Cohere North Mini Code |
| `stepfun/step-3.7-flash:free` | StepFun Step 3.7 Flash |
| `kwaipilot/kat-coder-pro-v2.5:free` | KAT-Coder Pro V2.5 |
| `tencent/hy3:free` | Tencent Hy3 |
| `nvidia/nemotron-3.5-content-safety:free` | Nemotron Content Safety |

## Notes

- `tos: "caution"`, `trainsOnPrompts: true` — avoid sensitive content.
- ~200 req/hr per IP. No registration needed.
- Throws on non-2xx with status and response body.

## License

MIT

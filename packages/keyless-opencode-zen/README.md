# @chirag127/keyless-opencode-zen

Keyless [OpenCode Zen](https://opencode.ai/zen) client. OpenAI-compatible `chat()`. **No API key** — free, uncapped models. Zero runtime deps. Works in Node and the browser via global `fetch`.

## Install

```sh
npm i @chirag127/keyless-opencode-zen
```

## Use

```js
import { chat, MODELS, DEFAULT_MODEL } from '@chirag127/keyless-opencode-zen';

// string prompt or a messages array — no key needed
const reply = await chat('Explain HMAC in one line.');

// pick a model
await chat([{ role: 'user', content: 'hi' }], { model: 'opencode/nemotron-3-super-free' });

// override endpoint or pass extra OpenAI params
await chat('hi', { baseUrl: 'https://opencode.ai/zen/v1', temperature: 0.2 });
```

## API

### `chat(messages, opts?) => Promise<string>`

Non-streaming. POSTs `{baseUrl}/chat/completions` — **no auth header**.

| opt | default | note |
|---|---|---|
| `model` | `'opencode/nemotron-3-ultra-free'` | any id from `MODELS` |
| `baseUrl` | `https://opencode.ai/zen/v1` | OpenCode Zen endpoint |
| `signal` | — | `AbortSignal` |
| ...rest | — | passed through (`temperature`, `max_tokens`, …) |

## Models

Source: OmniRoute `freeModelCatalog.data.ts` — `provider: "opencode-zen"`, `freeType: "recurring-uncapped"`, `poolKey: "opencode-zen-free"`. Sorted strongest-first.

| Model | Notes |
|---|---|
| `opencode/nemotron-3-ultra-free` | **Default** — Nemotron 3 Ultra (free) |
| `opencode/nemotron-3-super-free` | Nemotron 3 Super (free) |
| `opencode/deepseek-v4-flash-free` | DeepSeek V4 Flash (free) |
| `opencode/mimo-v2.5-free` | MiMo V2.5 (free) |
| `opencode/north-mini-code-free` | North Mini Code (free) |
| `opencode/big-pickle` | Big Pickle (stealth) |

## Notes

- `tos: "caution"` — no account needed, uncapped but rate-limited.
- Throws on non-2xx with status and response text.

## License

MIT

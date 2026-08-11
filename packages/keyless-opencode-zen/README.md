# @chirag127/keyless-opencode-zen

> **WARNING: NOT keyless — requires `ZEN_API_KEY`.**
> `https://opencode.ai/zen/v1` returns 401 "Missing API key" without auth.
> Use [`@chirag127/keyless-ai`](../keyless-ai) or another keyless provider instead.

OpenCode Zen client. OpenAI-compatible `chat()`. Requires `ZEN_API_KEY` env var — `chat()` throws immediately without it.

## Install

```sh
npm i @chirag127/keyless-opencode-zen
```

## Use

```js
// ZEN_API_KEY must be set in env — chat() throws without it
process.env.ZEN_API_KEY = 'your-key';
import { chat, MODELS, DEFAULT_MODEL } from '@chirag127/keyless-opencode-zen';

const reply = await chat('Explain HMAC in one line.');
await chat([{ role: 'user', content: 'hi' }], { model: 'opencode/nemotron-3-super-free' });
```

## API

### `chat(messages, opts?) => Promise<string>`

Throws `Error` immediately if `ZEN_API_KEY` is not set. Otherwise POSTs `{baseUrl}/chat/completions` with `Authorization: Bearer <ZEN_API_KEY>`.

| opt | default | note |
|---|---|---|
| `model` | `'opencode/nemotron-3-ultra-free'` | any id from `MODELS` |
| `baseUrl` | `https://opencode.ai/zen/v1` | OpenCode Zen endpoint |
| `signal` | — | `AbortSignal` |
| ...rest | — | passed through (`temperature`, `max_tokens`, …) |

## Models

Source: OmniRoute `freeModelCatalog.data.ts` — `provider: "opencode-zen"`, `authType: "apikey"`.

| Model | Notes |
|---|---|
| `opencode/nemotron-3-ultra-free` | **Default** — Nemotron 3 Ultra |
| `opencode/nemotron-3-super-free` | Nemotron 3 Super |
| `opencode/deepseek-v4-flash-free` | DeepSeek V4 Flash |
| `opencode/mimo-v2.5-free` | MiMo V2.5 |
| `opencode/north-mini-code-free` | North Mini Code |
| `opencode/big-pickle` | Big Pickle |

## Notes

- Requires `ZEN_API_KEY` — `chat()` throws without it.
- OmniRoute marks this provider `authType: "apikey"`, not keyless.

## License

MIT

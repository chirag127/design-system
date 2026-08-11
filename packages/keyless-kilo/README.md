# @chirag127/keyless-kilo

Keyless [Kilo Gateway](https://kilo.ai) client. OpenAI-compatible chat, **no API key** — Kilo Gateway is a keyless provider gated only by IP rate limit (~200 req/hr per IP).

Framework-agnostic, zero deps, works in Node + browser via global `fetch`.

## Install

```sh
npm i @chirag127/keyless-kilo
```

## Usage

No key. No auth header. Just call `chat`.

```js
import { chat, MODELS, DEFAULT_MODEL } from '@chirag127/keyless-kilo';

// string prompt
const reply = await chat('Explain HMAC in one line.');
console.log(reply);

// messages array + a specific model
await chat(
	[
		{ role: 'system', content: 'You are terse.' },
		{ role: 'user', content: 'hi' },
	],
	{ model: 'openrouter/free' },
);
```

`chat(messages, opts?) -> Promise<string>` — non-streaming. Returns the assistant text (`choices[0].message.content`).

`messages` is a string or `{ role, content }[]`.

### Options

| opt | default | note |
|---|---|---|
| `model` | `DEFAULT_MODEL` (`kilo-auto/free`) | any id from `MODELS` |
| `baseUrl` | `https://api.kilo.ai/api/gateway` | override the gateway |
| `signal` | — | `AbortSignal` |
| ...rest | — | passed through into the request body (e.g. `temperature`) |

Posts `{ model, messages, ...rest }` to `{baseUrl}/chat/completions`. Throws on non-2xx.

## Models

```js
import { MODELS, DEFAULT_MODEL } from '@chirag127/keyless-kilo';
```

- `kilo-auto/free` (**default**)
- `openrouter/free`
- `poolside/laguna-xs-2.1:free`
- `stepfun/step-3.7-flash:free`
- `nvidia/nemotron-3-super-120b-a12b:free`
- `nvidia/nemotron-3-ultra-550b-a55b:free`
- `cohere/north-mini-code:free`

## License

MIT

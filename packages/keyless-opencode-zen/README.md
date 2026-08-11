# @chirag127/keyless-opencode-zen

Keyless [OpenCode Zen](https://opencode.ai/zen) client. OpenAI-compatible `chat(messages, opts) -> Promise<string>`. **No API key** — these are keyless free models. Global `fetch`, zero runtime deps. Works in Node and the browser.

## Install

```sh
npm i @chirag127/keyless-opencode-zen
```

## Use

```js
import { chat, MODELS, DEFAULT_MODEL } from '@chirag127/keyless-opencode-zen';

// string prompt or a messages array — no key needed
const reply = await chat('Explain HMAC in one line.');
console.log(reply);

// pick a model
await chat([{ role: 'user', content: 'hi' }], { model: 'mimo-v2.5-free' });

// override the endpoint or pass extra OpenAI params
await chat('hi', { baseUrl: 'https://opencode.ai/zen/v1', temperature: 0.2 });
```

Non-streaming. POSTs `{baseUrl}/chat/completions` with body `{ model, messages, ...rest }` and **no auth header**. Returns `choices[0].message.content`; throws on non-2xx.

## API

- `chat(messages, opts?)` — `messages` is a string or `{ role, content }[]`. `opts`: `{ model, baseUrl, signal, ...openAIParams }`. Returns the assistant text.
- `MODELS` — known keyless model IDs:
  `deepseek-v4-flash-free`, `nemotron-3-ultra-free`, `north-mini-code-free`, `mimo-v2.5-free`.
- `DEFAULT_MODEL` — `deepseek-v4-flash-free`.
- `DEFAULT_BASE_URL` — `https://opencode.ai/zen/v1`.

## Test

```sh
npm test
```

## License

MIT

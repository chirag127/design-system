# @chirag127/keyless-pollinations

Keyless [Pollinations](https://pollinations.ai) text client. OpenAI-compatible, **no API key** — never reads or requires one. Framework-agnostic (Node ≥18 + browser, uses global `fetch`).

## Install

```sh
npm i @chirag127/keyless-pollinations
```

## Use

```js
import { chat, MODELS, DEFAULT_MODEL } from '@chirag127/keyless-pollinations';

const reply = await chat('Say hello in one word.');
// or a full messages array + options:
const reply2 = await chat(
	[
		{ role: 'system', content: 'You are terse.' },
		{ role: 'user', content: 'ping' },
	],
	{ model: 'mistral' }, // default: 'openai'
);
```

`chat(messages, opts?) -> Promise<string>` (non-streaming). `messages` is an OpenAI-style array, or a plain string (wrapped as one user message).

### Options

| opt       | default                                    | note                          |
| --------- | ------------------------------------------ | ----------------------------- |
| `model`   | `DEFAULT_MODEL` (`'openai'`)               | one of `MODELS`               |
| `baseUrl` | `https://text.pollinations.ai/openai`      | OpenAI-compatible base        |
| `signal`  | —                                          | `AbortSignal`                 |
| ...rest   | —                                          | passed through to request body |

### Exports

- `chat(messages, opts?)` — non-stream completion → string
- `MODELS` — `['openai', 'openai-fast', 'mistral']`
- `DEFAULT_MODEL` — `'openai'`
- `toMessages(input)` — string → messages array

## Mechanism

`POST {baseUrl}/chat/completions` with body `{ model, messages }`, `Content-Type: application/json`, **no `Authorization` header**. Reads `choices[0].message.content`.

## Note

Keyless and free — **intermittent `402` responses are possible** when the shared quota is saturated. `chat` throws on any non-2xx (message includes the status); retry or fall back to another `model`.

## License

MIT

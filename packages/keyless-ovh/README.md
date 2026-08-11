# @chirag127/keyless-ovh

Keyless [OVHcloud AI Endpoints](https://endpoints.ai.cloud.ovh.net/) client. OpenAI-compatible chat completions. **No API key** — never require or read one.

## Install

```sh
npm i @chirag127/keyless-ovh
```

## Usage

```js
import { chat, MODELS, DEFAULT_MODEL } from '@chirag127/keyless-ovh';

// string prompt
const reply = await chat('Explain vector databases in one line.');

// messages array + options
const reply2 = await chat(
	[
		{ role: 'system', content: 'You are terse.' },
		{ role: 'user', content: 'Hello' },
	],
	{ model: 'gpt-oss-20b', temperature: 0.2 }
);

console.log(MODELS, DEFAULT_MODEL);
```

Runs in Node 18+ and the browser — uses global `fetch`, no dependencies.

## API

### `chat(messages, opts?) => Promise<string>`

Non-streaming. POSTs `{model, messages}` to `{baseUrl}/chat/completions` with no auth header. Returns `choices[0].message.content`.

- `messages` — array of `{role, content}` or a plain string (wrapped as one user message).
- `opts.model` — default `Meta-Llama-3_3-70B-Instruct`.
- `opts.baseUrl` — default `https://oai.endpoints.kepler.ai.cloud.ovh.net/v1`.
- `opts.signal` — `AbortSignal`.
- any other key (`temperature`, `max_tokens`, …) is passed through to the request body.

### `MODELS`

```
Meta-Llama-3_3-70B-Instruct   (default)
Qwen3.5-397B-A17B
gpt-oss-120b
Mistral-Small-3.2-24B-Instruct-2506
Qwen3-32B
Qwen3-Coder-30B-A3B-Instruct
gpt-oss-20b
```

### `DEFAULT_MODEL`, `DEFAULT_BASE_URL`, `toMessages(input)`

## Test

```sh
npm test
```

## License

MIT

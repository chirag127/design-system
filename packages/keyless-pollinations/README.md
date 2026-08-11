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
	{ model: 'mistral' },
);
```

`chat(messages, opts?) -> Promise<string>` (non-streaming). `messages` is an OpenAI-style array, or a plain string (wrapped as one user message).

### Options

| opt       | default                               | note                           |
| --------- | ------------------------------------- | ------------------------------ |
| `model`   | `DEFAULT_MODEL` (`'openai-large'`)    | one of `MODELS`                |
| `baseUrl` | `https://text.pollinations.ai/openai` | OpenAI-compatible base         |
| `signal`  | —                                     | `AbortSignal`                  |
| ...rest   | —                                     | passed through to request body |

### Exports

- `chat(messages, opts?)` — non-stream completion → string
- `MODELS` — all keyless model IDs (see table below)
- `DEFAULT_MODEL` — `'openai-large'`
- `toMessages(input)` — string → messages array

## Models

Source: OmniRoute `freeModelCatalog.data.ts` — `provider: "pollinations"`, `freeType: "keyless"`.

| Model | Notes |
|---|---|
| `openai-large` | **Default** — strongest OpenAI model |
| `openai` | OpenAI standard |
| `openai-fast` | OpenAI fast |
| `qwen-coder-large` | Qwen Coder large |
| `qwen-large` | Qwen large |
| `mistral-large` | Mistral large |
| `mistral` | Mistral |
| `deepseek` | DeepSeek |
| `grok-large` | Grok large |
| `grok` | Grok |
| `kimi` | Kimi (Moonshot) |
| `gemini-large` | Gemini large |
| `gemini-flash-lite-3.1` | Gemini Flash Lite 3.1 |
| `gemini-search` | Gemini Search |
| `qwen-coder` | Qwen Coder |
| `qwen-vision` | Qwen Vision |
| `qwen-safety` | Qwen Safety |
| `nova` | Nova |
| `nova-fast` | Nova fast |
| `glm` | GLM |
| `minimax` | MiniMax |
| `perplexity-reasoning` | Perplexity Reasoning |
| `perplexity-fast` | Perplexity Fast |
| `polly` | Polly |

## Mechanism

`POST {baseUrl}/chat/completions` with body `{ model, messages }`, `Content-Type: application/json`, **no `Authorization` header**. Reads `choices[0].message.content`.

## Notes

- Rate-limited per IP — no account needed.
- `tos: "caution"` — intermittent `402` responses are possible when shared quota is saturated.
- `chat` throws on any non-2xx; retry or override `model`.

## License

MIT

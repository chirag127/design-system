# @chirag127/keyless-ovh

Keyless [OVHcloud AI Endpoints](https://endpoints.ai.cloud.ovh.net/) client. OpenAI-compatible chat completions. **No API key** — anonymous endpoint, no auth header.

Framework-agnostic, zero deps, works in Node ≥18 + browser via global `fetch`.

**Note:** IP-rate-limited (429). On 429, `chat()` throws with `err.retryable = true` — check this flag to distinguish rate-limit from hard failures.

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

// handle 429
try {
  await chat('hi');
} catch (err) {
  if (err.retryable) { /* rate limited — retry later */ }
  else throw err;
}
```

## API

### `chat(messages, opts?) => Promise<string>`

Non-streaming. POSTs `{model, messages}` to `{baseUrl}/chat/completions` — **no auth header**. Returns `choices[0].message.content`.

On 429 the thrown `Error` has `.retryable = true`.

| opt | default | note |
|---|---|---|
| `model` | `'gpt-oss-120b'` | any id from `MODELS` |
| `baseUrl` | `https://oai.endpoints.kepler.ai.cloud.ovh.net/v1` | OVH anonymous endpoint |
| `signal` | — | `AbortSignal` |
| ...rest | — | passed through (`temperature`, `max_tokens`, …) |

## Models

Source: OmniRoute `freeModelCatalog.data.ts` — `provider: "ovhcloud"`, `freeType: "keyless"`, `poolKey: "ovhcloud-anon"`.

| Model | Notes |
|---|---|
| `gpt-oss-120b` | **Default** — GPT-OSS 120B |
| `Qwen3.6-27B` | Qwen 3.6 27B |
| `Qwen2.5-VL-72B-Instruct` | Qwen 2.5 VL 72B (vision) |
| `Mistral-Small-3.2-24B-Instruct-2506` | Mistral Small 3.2 |
| `gpt-oss-20b` | GPT-OSS 20B (fast) |

## Notes

- `tos: "ok"` — keyless anonymous endpoint, no registration needed.
- IP rate-limited (429) — check `err.retryable` to detect.
- Throws on non-2xx with the status and response body.

## License

MIT

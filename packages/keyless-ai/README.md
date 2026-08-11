# @chirag127/keyless-ai

Keyless AI failover meta-client. Wraps 4 keyless, OpenAI-compatible providers and tries them best-first — first success wins, throws only if **all** fail. **No API key** anywhere.

## Install

```sh
npm i @chirag127/keyless-ai
```

Pulls the 4 provider packages as deps. Zero runtime deps beyond them; uses global `fetch` (Node 18+ / browser).

## Usage

```js
import { chat, listProviders, MODELS } from '@chirag127/keyless-ai';

// string prompt or OpenAI messages[]
const text = await chat('explain failover in one line');

const text2 = await chat([
  { role: 'system', content: 'Be terse.' },
  { role: 'user', content: 'hi' },
]);

listProviders(); // ['opencode-zen','kilo','ovh','pollinations']
```

### Override order

```js
// per-call
await chat('hi', { order: ['kilo', 'ovh'] });

// or env (comma-separated), consumed when opts.order is absent
// KEYLESS_ORDER="ovh,pollinations"
```

### Observe failures

```js
await chat('hi', {
  onError: (name, err) => console.warn(`skip ${name}: ${err.message}`),
});
```

Any other opts (`model`, `temperature`, `signal`, `baseUrl`, …) pass straight through to whichever provider handles the call.

### Failure mode

If every provider in the order throws, `chat` throws an `AggregateError` whose `.errors` holds the per-provider failures.

## Providers (default order)

| Order | Provider key | Package | Endpoint |
|---|---|---|---|
| 1 | `kilo` | `@chirag127/keyless-kilo` | api.kilo.ai/api/gateway |
| 2 | `opencode-zen` | `@chirag127/keyless-opencode-zen` | opencode.ai/zen/v1 |
| 3 | `ovh` | `@chirag127/keyless-ovh` | oai.endpoints.kepler.ai.cloud.ovh.net/v1 |
| 4 | `pollinations` | `@chirag127/keyless-pollinations` | text.pollinations.ai/openai |

Ranking rationale: capability-first, paywall-last only. `kilo` leads with nemotron-3-ultra-550b (strongest free OSS, 550B); `opencode-zen` has nemotron-ultra-free + deepseek-v4-flash + minimax-m2.5; `ovh` provides gpt-oss-120b (reliable); `pollinations` goes last (higher 402/paywall rate).

## Combined model list (`MODELS`)

`MODELS` is the **only** place the cross-provider model catalogue lives. Shape: `{ provider: string, model: string }[]`. Sorted strongest-first within each provider, providers in `DEFAULT_ORDER`.

```js
import { MODELS, DEFAULT_ORDER } from '@chirag127/keyless-ai';

// MODELS[0] => { provider: 'opencode-zen', model: 'opencode/nemotron-3-ultra-free' }
// Filter by provider:
const kiloModels = MODELS.filter(m => m.provider === 'kilo');
```

Full table (49 models across 4 providers):

| # | provider | model |
|---|---|---|
| 1 | kilo | `nvidia/nemotron-3-ultra-550b-a55b:free` |
| 2 | kilo | `nvidia/nemotron-3-super-120b-a12b:free` |
| 3 | kilo | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` |
| 4 | kilo | `kilo-auto/free` |
| 5 | kilo | `openrouter/auto-beta` |
| 6 | kilo | `openrouter/free` |
| 7 | kilo | `poolside/laguna-m.1:free` |
| 8 | kilo | `poolside/laguna-xs-2.1:free` |
| 9 | kilo | `cohere/north-mini-code:free` |
| 10 | kilo | `stepfun/step-3.7-flash:free` |
| 11 | kilo | `kwaipilot/kat-coder-pro-v2.5:free` |
| 12 | kilo | `tencent/hy3:free` |
| 13 | kilo | `nvidia/nemotron-3.5-content-safety:free` |
| 14 | opencode-zen | `opencode/nemotron-3-ultra-free` |
| 15 | opencode-zen | `opencode/nemotron-3-super-free` |
| 16 | opencode-zen | `opencode/deepseek-v4-flash-free` |
| 17 | opencode-zen | `opencode/mimo-v2.5-free` |
| 18 | opencode-zen | `opencode/north-mini-code-free` |
| 19 | opencode-zen | `opencode/big-pickle` |
| 20 | ovh | `gpt-oss-120b` |
| 21 | ovh | `Qwen3.6-27B` |
| 22 | ovh | `Qwen2.5-VL-72B-Instruct` |
| 23 | ovh | `Mistral-Small-3.2-24B-Instruct-2506` |
| 24 | ovh | `gpt-oss-20b` |
| 25 | pollinations | `openai-large` |
| 26 | pollinations | `openai` |
| 27 | pollinations | `openai-fast` |
| 28 | pollinations | `qwen-coder-large` |
| 29 | pollinations | `qwen-large` |
| 30 | pollinations | `mistral-large` |
| 31 | pollinations | `mistral` |
| 32 | pollinations | `deepseek` |
| 33 | pollinations | `grok-large` |
| 34 | pollinations | `grok` |
| 35 | pollinations | `kimi` |
| 36 | pollinations | `gemini-large` |
| 37 | pollinations | `gemini-flash-lite-3.1` |
| 38 | pollinations | `gemini-search` |
| 39 | pollinations | `qwen-coder` |
| 40 | pollinations | `qwen-vision` |
| 41 | pollinations | `qwen-safety` |
| 42 | pollinations | `nova` |
| 43 | pollinations | `nova-fast` |
| 44 | pollinations | `glm` |
| 45 | pollinations | `minimax` |
| 46 | pollinations | `perplexity-reasoning` |
| 47 | pollinations | `perplexity-fast` |
| 48 | pollinations | `polly` |

## Astro / browser

```astro
---
import { chat } from '@chirag127/keyless-ai';
const answer = await chat('one keyless tagline');
---
<p>{answer}</p>
```

## Test

```sh
npm test   # vitest, mocks each provider
```

MIT © chirag127

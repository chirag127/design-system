# @chirag127/keyless-ai

Keyless AI failover meta-client. Wraps 3 keyless, OpenAI-compatible providers and tries them best-first — first success wins, throws only if **all** fail. **No API key** anywhere.

## Install

```sh
npm i @chirag127/keyless-ai
```

Pulls the 3 provider packages as deps. Zero runtime deps beyond them; uses global `fetch` (Node 18+ / browser).

## Usage

```js
import { chat, listProviders, MODELS } from '@chirag127/keyless-ai';

// string prompt or OpenAI messages[]
const text = await chat('explain failover in one line');

const text2 = await chat([
  { role: 'system', content: 'Be terse.' },
  { role: 'user', content: 'hi' },
]);

listProviders(); // ['kilo','ovh','pollinations']
```

### Override order

```js
// per-call
await chat('hi', { order: ['ovh', 'kilo'] });

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

| Order | Provider key | Package | Endpoint | Notes |
|---|---|---|---|---|
| 1 | `kilo` | `@chirag127/keyless-kilo` | api.kilo.ai/api/gateway | `kilo-auto/free` auto-router; no auth |
| 2 | `ovh` | `@chirag127/keyless-ovh` | oai.endpoints.kepler.ai.cloud.ovh.net/v1 | 429 → `err.retryable=true` |
| 3 | `pollinations` | `@chirag127/keyless-pollinations` | text.pollinations.ai/openai | sends `Referer: https://oriz.in` |

**opencode-zen removed** — NOT keyless (requires `ZEN_API_KEY`). See `@chirag127/keyless-opencode-zen` README.

## Combined model list (`MODELS`)

`MODELS` is the **only** place the cross-provider model catalogue lives. Shape: `{ provider: string, model: string }[]`. Sorted best-first within each provider, providers in `DEFAULT_ORDER`.

```js
import { MODELS, DEFAULT_ORDER } from '@chirag127/keyless-ai';

// MODELS[0] => { provider: 'kilo', model: 'kilo-auto/free' }
// Filter by provider:
const ovhModels = MODELS.filter(m => m.provider === 'ovh');
```

## Test

```sh
npm test   # vitest, mocks each provider
```

MIT © chirag127

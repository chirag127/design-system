# @chirag127/keyless-ai

Keyless AI failover meta-client. Wraps 4 keyless, OpenAI-compatible providers and tries them best-first — first success wins, throws only if **all** fail. **No API key** anywhere.

## Providers (default order)

| Order | Package | Endpoint |
|---|---|---|
| 1 | `@chirag127/keyless-opencode-zen` | opencode.ai/zen/v1 |
| 2 | `@chirag127/keyless-kilo` | api.kilo.ai/api/gateway |
| 3 | `@chirag127/keyless-ovh` | OVHcloud AI Endpoints |
| 4 | `@chirag127/keyless-pollinations` | text.pollinations.ai/openai |

Default `opencode-zen -> kilo -> ovh -> pollinations`: zen/kilo have strong free models; pollinations 402s often, so it's last.

## Install

```sh
npm i @chirag127/keyless-ai
```

Pulls the 4 provider packages as deps. Zero runtime deps beyond them; uses global `fetch` (Node 18+ / browser).

## Usage

```js
import { chat, listProviders } from '@chirag127/keyless-ai';

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

## Astro / browser

Framework-agnostic — pure ESM + global `fetch`. Import in an Astro component, a browser bundle, or a Node script identically. No key, so safe client-side.

```astro
---
import { chat } from '@chirag127/keyless-ai';
const answer = await chat('one keyless tagline');
---
<p>{answer}</p>
```

## Node

```js
import { chat } from '@chirag127/keyless-ai';
console.log(await chat(process.argv[2] ?? 'hello'));
```

## Test

```sh
npm test   # vitest, mocks each provider
```

MIT © chirag127

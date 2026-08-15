# steps.json

Slim hop list written by `npm run capture` at `<runDir>/steps.json`. One object. No extra top-level keys.

## Required keys

| Key | Type | Meaning |
| --- | --- | --- |
| `startUrl` | string | The URL the walker opened first. |
| `stoppedBeforePayment` | `true` | Capture refuses to type PII or submit payment. Always `true` on a successful run. |
| `steps` | array | One object per recorded stage, in walk order. |

## Step object

| Key | Type | Meaning |
| --- | --- | --- |
| `name` | string | `landing`, `add_to_cart`, `cart`, or `checkout`. |
| `url` | string | Absolute URL after that hop. |
| `intents` | array | Walker intents that produced the hop (`open_product`, `add_to_cart`, `open_cart`, `go_to_checkout`). Empty on landing. |
| `paymentUiDetected` | boolean | True when card chrome was visible (iframe host or credit-card form labels). |
| `screenshot` | string | Path relative to the run directory. |

This file is the chat handoff. `bundle.json` stays on disk for scoring. Do not paste `bundle.json`.

## Example

```json
{
  "startUrl": "https://tonal.com/",
  "stoppedBeforePayment": true,
  "steps": [
    {
      "name": "landing",
      "url": "https://tonal.com/",
      "intents": [],
      "paymentUiDetected": false,
      "screenshot": "artifacts/landing.png"
    },
    {
      "name": "checkout",
      "url": "https://tonal.com/checkouts/cn/abc",
      "intents": ["go_to_checkout"],
      "paymentUiDetected": true,
      "screenshot": "artifacts/checkout.png"
    }
  ]
}
```

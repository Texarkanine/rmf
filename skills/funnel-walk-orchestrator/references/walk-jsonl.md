# walk.jsonl

The step-judgement handoff at the run directory root. One JSON object per line. No extra top-level keys on a line.

## Required keys

| Key | Type | Meaning |
| --- | --- | --- |
| `step` | number | 1-based hop index. |
| `kind` | string | `destination`, `product`, `cart`, `checkout`, `blocker`, or `other`. |
| `url` | string | Absolute HTTP(S) URL of the page that was opened. |
| `judgements` | array | Skill results for this hop. Empty when `kind` is `blocker` or `other`. |

## Optional keys

| Key | Type | Meaning |
| --- | --- | --- |
| `screenshot` | string | Path relative to the run directory. Present only when that file exists on disk. |
| `signals` | array of string | Present flags only. Allowed values: `overlay`, `account_wall`, `priced_offer`, `ads_present`. Omit the key when none apply. |

## Judgement object

Each element of `judgements` is an object with `skill` and exactly one of `judge` or `error`.

| Key | Type | Meaning |
| --- | --- | --- |
| `skill` | string | Allowlisted skill name (`cro`, `ad-creative`, `popups`, `offers`, `signup`). |
| `judge` | string | The subagent's judgement of this page. Omit when the skill could not be applied. |
| `error` | string | Why the skill was not applied (fetch failed, subagent failed). Omit when `judge` is present. |

Do not invent a `judge` string. Do not write `screenshot` for a file that is not on disk.

## Example

```json
{"step":1,"kind":"destination","url":"https://example.com/","screenshot":"artifacts/01-destination.png","signals":["ads_present","overlay"],"judgements":[{"skill":"cro","judge":"Hero sells the brand, not the ad's 30-day transformation."},{"skill":"ad-creative","judge":"Hook is specific; destination does not continue it."},{"skill":"popups","judge":"Cookie wall before any offer is readable."}]}
```

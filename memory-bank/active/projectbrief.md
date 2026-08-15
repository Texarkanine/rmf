# Project Brief

## User Story

As an operator running a funnel roast, I want a failed walk (a hop that is not the real page) to stop the roast so that we never judge a Cloudflare challenge, interstitial, or other incorrect capture as if it were the store.

## Use-Case(s)

### Use-Case 1

The walker records `/cart` but the screenshot and copy are a Cloudflare “Verifying…” screen. The roast must not write cart analysis or a report that treats that screen as cart UX. The agent recovers the real cart if it can, or bails and tells the operator that analysis cannot be completed.

### Use-Case 2

The CLI exits 0 and `steps.json` exists. That is not enough. The agent inspects hop artifacts before judging. A successful-looking hop list with a failed page is still a failed walk.

## Requirements

1. Add awareness, in the walk and/or roast skills, that a hop which is not the intended page is a walk failure.
2. The agent decides how to handle it (retry, wait, dismiss, or stop). Do not prescribe a Cloudflare solver or a catalog of challenge vendors.
3. Bailing out and telling the operator that analysis cannot be completed is an acceptable end state — and a better one than analyzing an incorrect walk.
4. Do not write hop analysis or `report.html` against a failed hop.

## Constraints

1. Do not over-specify handling. Awareness of failure belongs to the agent; recovery tactics are the agent's call.
2. Walker-does-not-judge still holds. Detecting “this is not the page” is capture integrity, not a CRO score.
3. Stop-before-PII and stop-before-payment still hold. Recovery must not type email, address, or card data.
4. Do not invent hops or pages to fill a hole.

## Acceptance Criteria

1. Skills that walk or roast say a hop that is not the real destination is a walk failure.
2. Those skills say: recover if you can, or abort and tell the operator. Abort is preferred to judging the wrong page.
3. `start-the-roast` does not proceed to per-hop analysis or the report when the walk failed in that sense.
4. Handling is not hardcoded to Cloudflare or to a single recovery recipe.

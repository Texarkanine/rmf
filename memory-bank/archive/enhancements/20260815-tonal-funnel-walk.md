---
task_id: tonal-funnel-walk
complexity_level: 2
date: 2026-08-15
status: completed
---

# TASK ARCHIVE: tonal-funnel-walk

## SUMMARY

Proved the Playwright walker can take `https://tonal.com/` from homepage through a real cart to Shopify checkout with empty credit-card fields, then stop. Hardened cart navigation (AJAX add-to-cart + drawer does not change the URL). Added `npm test`, `paymentUiDetected`, slim `steps.json`, and the `/walk-the-funnel` skill so a fresh session can rerun the walk in ~20s and print the hop list.

## REQUIREMENTS

From the project brief:

- Walk `https://tonal.com/` as a shopper: destination → product → cart → checkout.
- Record the hop sequence.
- Reach visible credit-card / payment fields.
- Stop before entering payment or any personal information.
- Work on a branch off `main`.

Later operator ask (same branch): ship `skills/walk-the-funnel` that sics Playwright on a URL and finishes fast with `steps.json`.

## IMPLEMENTATION

Level 2. Live Tonal walk first, then the smallest heuristic gap.

Key files:

- `src/capture/funnel.ts` — `isReachedCart`, `/cart` fallback, payment-stop helpers, write `steps.json`
- `src/capture/evidence.ts` — `detectPaymentUi` plus credit-card form labels
- `src/capture/steps.ts` — slim hop list
- `src/capture/*.test.ts` — `node:test` via `npm test`
- `skills/walk-the-funnel/` — four-step skill: URL, install-if-missing, `HEADLESS=1` capture, print `steps.json`
- `docs/visual-explainer/tonal-funnel-walk.html` — recorded hop sequence

Did not type email/address/card. Did not use UCP/MCP or the Shop skill.

## TESTING

- `npm test`: 16 passing cases (`classifyPage`, cart URL helpers, payment-stop, `PAYMENT_SUBMIT`, payment UI, `toSteps`).
- `npx tsc --noEmit` passed during QA.
- Live `HEADLESS=1 npm run capture -- https://tonal.com/`: `tonal-walk-3` and `walk-skill-demo` (~20s) reached `/cart` then `/checkouts/cn/…` with `paymentUiDetected: true` and `stoppedBeforePayment: true`.
- Preflight: PASS WITH ADVISORY. QA: PASS (JSDoc advisory fixed).

## LESSONS LEARNED

- Shopify “in cart” on the PDP is not a cart page. Assert on URL class, then fall back to `/cart` on the same origin when the drawer does not navigate.
- Tonal checkout paints card chrome in the main document. Iframe-host detection alone was a false negative; form labels (“Credit card”) are the signal.
- Treat cart the way checkout was already treated: click, then origin-relative fallback.
- `/niko` on “can we walk this?” spent most of the clock on ceremony. The walk itself is ~20s. `/walk-the-funnel` is the repeatable entrypoint.

## PROCESS IMPROVEMENTS

- Run the live walk before tightening assertions. The first successful-but-dishonest cart stage was the useful failure.
- Do not invoke Niko for a capture-and-print question. Use the walk skill.

## TECHNICAL IMPROVEMENTS

`bundle.json` is ~230KB of tracking-pixel redirects. Later scoring should keep consuming the bundle; chat and later hop consumers should use `steps.json`.

## NEXT STEPS

None for this task. A fresh session runs `/walk-the-funnel https://tonal.com/` and should print `steps.json` in about 20s after deps exist.

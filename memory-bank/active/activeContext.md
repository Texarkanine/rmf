# Active Context

## Current Task: tonal-funnel-walk
**Phase:** QA - COMPLETE (PASS)

## What Was Done
- Added `node:test` (`npm test`) and locked `classifyPage`, payment-stop guards, and `PAYMENT_SUBMIT`.
- Added `paymentUiDetected` on each stage (iframe hosts + credit-card form labels).
- Live Tonal walk: first run reached checkout but recorded the PDP as cart; after `/cart` fallback, `tonal-walk-3` hit landing → `/products/tonal-2` → `/cart` → `/checkouts/cn/…` with empty card fields and `stoppedBeforePayment: true`.
- Published `docs/visual-explainer/tonal-funnel-walk.html`.

## Files created or modified
- `/workspace/package.json`
- `/workspace/memory-bank/techContext.md`
- `/workspace/src/types.ts`
- `/workspace/src/capture/funnel.ts`
- `/workspace/src/capture/funnel.test.ts`
- `/workspace/src/capture/resolve.test.ts`
- `/workspace/src/capture/evidence.ts`
- `/workspace/src/capture/evidence.test.ts`
- `/workspace/docs/visual-explainer/tonal-funnel-walk.html`

## Key implementation decisions
- Do not type email to reveal more payment UI; Tonal already shows card placeholders on checkout page load.
- Cart drawer does not change the URL; fall back to `/cart` on the same origin.
- Keep payment-UI detection on the walker side only.

## Deviations from Plan
- First live run succeeded to checkout before the cart-page assertion existed; step 4 then tightened cart and re-ran as `tonal-walk-3`.
- `detectPaymentUi` iframe hosts alone were false on Tonal checkout; added `hasPaymentFieldLabels` after the live miss.

## Next Step
- Proceed to the next workflow phase.

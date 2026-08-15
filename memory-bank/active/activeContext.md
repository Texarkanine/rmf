# Active Context

## Current Task: tonal-funnel-walk
**Phase:** PREFLIGHT - COMPLETE (PASS WITH ADVISORY)

## What Was Done
- Classified as Level 2 and stubbed ephemeral files.
- Probed Tonal: Shopify storefront, PDP at `/products/tonal-2` with "Add to cart", rental/Whim CTAs on the same page, `robots.txt` disallows `/checkout` and `/checkouts/`.
- Planned a TDD lock on `classifyPage` + `PAYMENT_SUBMIT`, a live `npm run capture` against `https://tonal.com/`, heuristic fixes only for failed hops, and a visual explainer of the recorded sequence.
- Preflight validated the plan against the live codebase (`src/capture/*`), confirmed no downstream consumers outside `src/capture/`, verified Node 22 / `tsx --test` / `npm ci` prerequisites, and confirmed live `robots.txt` and PDP URL match the plan's stated edge cases.
- Applied one Radical Innovation finding to the plan: Step 1b adds `detectPaymentUi` as a structured evidence signal, kept inside `src/capture/`.

## Next Step
- `/niko-build` — implement per `memory-bank/active/tasks.md` (Steps 1, 1b, 2-6, in order).

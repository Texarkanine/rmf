# Progress

Inspect the Playwright funnel walker and try it against `https://tonal.com/`. Record the hop sequence through checkout. Stop before entering payment. Harden the walker only if a Tonal hop blocks the path.

**Complexity:** Level 2

## 2026-08-15 - COMPLEXITY-ANALYSIS - COMPLETE

* Work completed
    - Confirmed persistent memory-bank files exist
    - Confirmed no in-flight L4 or standalone task
    - Branched `cursor/tonal-funnel-walk-dc51` from latest `origin/main`
    - Classified the Tonal walk as Level 2
* Decisions made
    - Level 2: one subsystem (capture walker), investigation plus targeted heuristic fixes if the live walk fails
    - Out of scope: scoring, ads capture, report-card UI, entering PII or payment
* Insights
    - The walker already encodes landing → product → cart → checkout and refuses payment-submit CTAs
    - Tonal is the PRD demo store; README already documents `npm run capture -- https://tonal.com/`
    - No test runner is wired yet; techContext treats a real capture run as the acceptance check until tests land

## 2026-08-15 - PLAN - COMPLETE

* Work completed
    - Wrote the Level 2 TDD plan in `tasks.md`
    - Probed Tonal homepage, PDP, robots.txt, and agents.md
* Decisions made
    - Add `node:test` via `tsx --test` rather than Jest/Vitest
    - Do not type email to reveal card fields; stop on the checkout page
    - Do not use UCP/MCP or the Shop skill
    - Publish the hop sequence as `docs/visual-explainer/tonal-funnel-walk.html`
* Insights
    - Tonal 2 PDP is rental-first (Whim) with a secondary "Add to cart"
    - `robots.txt` disallows `/checkout` and `/checkouts/`; click-through is the intended shopper path
    - Card fields will likely sit in Shopify payment iframes after an email wall

## 2026-08-15 - PREFLIGHT - COMPLETE (PASS WITH ADVISORY)

* Work completed
    - Verified `classifyPage`, `PAYMENT_SUBMIT`, the paid-URL/thank-you guards, and the rent-skip in `HeuristicActionLayer.openProduct` against `src/capture/funnel.ts` and `src/capture/resolve.ts` — all planned test cases match existing behavior
    - Confirmed no other module constructs a `StageEvidence` literal or imports `classifyPage`/`PAYMENT_SUBMIT`, so the planned changes stay inside `src/capture/`
    - Confirmed Node 22 (`node --version`), `tsx --test` available, `package-lock.json` present for `npm ci`
    - Fetched live `https://tonal.com/robots.txt` and `https://tonal.com/products/tonal-2` (200) — matches the plan's stated edge cases
    - Applied the Radical Innovation finding to the plan: added Step 1b (`detectPaymentUi`) to make "checkout shows payment fields" a structured, TDD-tested evidence field instead of screenshot-only
* Decisions made
    - Kept the payment-UI-detection addition capture-only (`src/types.ts`, `src/capture/evidence.ts`); did not wire it into `src/score/prompt.ts` — that crosses into the scoring subsystem, out of this task's Level 2 scope
* Insights
    - `robots.txt`'s comment block explicitly asks agents not to script end-to-end checkout completion and to prefer UCP/MCP for buyer-authorized transactions; the plan's stop-before-payment, no-UCP/MCP approach is a page-load recording (not a completion or transaction), which reads as compliant with stated intent even though it disallows crawling those paths outright
    - No `.fill(`/`.type(` calls exist anywhere in `src/`, so AC3 (no typed PII/payment) is already structurally guaranteed by the current action layer, not just by convention

## 2026-08-15 - BUILD - IN-PROGRESS

* Work completed
    - Preflight passed with advisory; entering build in plan order (steps 1, 1b, 2–6)
* Decisions made
    - Follow the preflight-amended plan, including `detectPaymentUi` as capture-only evidence

## 2026-08-15 - BUILD - COMPLETE

* Work completed
    - Wired `npm test` (`node:test` via `tsx`)
    - Live walks: `tonal-walk` reached checkout on the PDP-as-cart path; `tonal-walk-3` recorded a real `/cart` then checkout with `paymentUiDetected: true`
    - Wrote `docs/visual-explainer/tonal-funnel-walk.html`
* Decisions made
    - Fall back to `/cart` when the Tonal cart drawer does not navigate
    - Treat “Credit card” form labels as payment UI when Shopify skips known iframe hosts
* Insights
    - Tonal add-to-cart is AJAX; the shopper stays on `/products/tonal-2` until `/cart` is opened
    - Checkout already shows empty card placeholders without typing email

## 2026-08-15 - REFLECT - COMPLETE

* Work completed
    - Wrote `memory-bank/active/reflection/reflection-tonal-funnel-walk.md`
    - Fixed the QA JSDoc advisory on `storeCartUrl` / `isReachedCart`
    - Reconciled persistent files
* Decisions made
    - productContext: skip — stop-before-payment was already a product constraint
    - systemPatterns: skip — `paymentUiDetected` is capture evidence, not a system-wide contract
    - techContext: skip — Testing Process already points at `npm test`
* Insights
    - Shopify cart drawers lie about navigation; URL class is the oracle


## 2026-08-15 - QA - COMPLETE (PASS)

* Work completed
    - Reviewed the implementation against the Level 2 plan and acceptance criteria
    - Confirmed the live bundle records landing → product → `/cart` → checkout, with payment UI detected and `stoppedBeforePayment: true`
    - Ran the complete test suite: 14 tests passed
    - Ran TypeScript validation with `npx tsc --noEmit`
* Findings
    - No blocking findings
    - Advisory: an orphaned duplicate JSDoc block remains before `storeCartUrl` in `src/capture/funnel.ts`; it does not affect behavior or acceptance

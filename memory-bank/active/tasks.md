# Task: tonal-funnel-walk

* Task ID: tonal-funnel-walk
* Complexity: Level 2
* Type: simple enhancement

Prove the Playwright walker can take `https://tonal.com/` from homepage to a checkout page that shows payment / card fields, record the hop sequence, and stop before entering PII or payment. Harden heuristics only for hops that fail on the live Tonal path.

## Test Plan (TDD)

### Behaviors to Verify

- [classify Tonal PDP]: `classifyPage("https://tonal.com/products/tonal-2")` → `"product"`
- [classify Tonal cart]: `classifyPage("https://tonal.com/cart")` → `"cart"`
- [classify Shopify checkout path]: `classifyPage("https://tonal.com/checkouts/cn/abc")` → `"checkout"`
- [classify hosted Shop checkout]: `classifyPage("https://shop.app/checkout/cn/abc")` → `"checkout"`
- [refuse payment submit]: `PAYMENT_SUBMIT` matches "Place order" / "Pay now" / "Complete purchase" and does not match "Checkout"
- [stop on thank-you copy]: checkout `visibleCopy` containing "thank you for your order" is a capture failure
- [stop on paid URL]: checkout URL matching `/paid` is a capture failure
- [prefer buy over rent]: `open_product` skips `purchase_type=rent` hrefs (already in `HeuristicActionLayer.openProduct`)
- [live Tonal walk]: `HEADLESS=1 npm run capture -- https://tonal.com/` → bundle with landing → add_to_cart → cart → checkout, `stoppedBeforePayment: true`, checkout screenshot/copy shows payment UI, no typed PII or card
- [honest stop]: if card fields are behind an email wall, the run stops on that checkout page and does not type email
- [detect payment UI]: `detectPaymentUi(page)` returns `true` when a page frame URL matches a known payment-iframe host (Shopify checkout, Stripe, PayPal, Braintree, Adyen), `false` when no frame matches

### Test Infrastructure

- Framework: none is wired today (`package.json` has no test script; techContext says a real capture/score run is the acceptance check until tests land)
- Decision: add Node's built-in `node:test` runner via `tsx --test`. No new package. This is the smallest runner that satisfies always-tdd without a parallel framework.
- Test location: colocated `src/capture/*.test.ts` (tsconfig already `include`s `src`)
- Conventions: new — `*.test.ts` next to the module under test; run with `npm test`
- New test files: `src/capture/funnel.test.ts`, `src/capture/resolve.test.ts`, `src/capture/evidence.test.ts`

### Edge Cases

- Homepage "SHOP NOW" lands on a non-product page → walker may need up to 3 `open_product` hops to reach `/products/tonal-2`
- PDP is rental-first (Whim "GET STARTED") with a secondary "Add to cart" — must click add-to-cart, not rent
- Shopify checkout often asks for email before card iframes appear — do not type email; record the page as reached
- Card fields live in payment iframes — `collectForms` may miss them; the checkout screenshot is the receipt
- `robots.txt` disallows `/checkout`, `/checkouts/`, `/cart/` — walker only checks the start URL; do not add a `page.goto("/checkout")` that fights robots if a click already failed; prefer click-through
- Do not use Tonal UCP/MCP or the Shop skill — that is a different product than the Playwright shopper walk

## Implementation Plan

1. [x] Lock URL classification and payment-stop contracts
   - Files: `package.json`, `src/capture/funnel.test.ts`, `src/capture/resolve.test.ts`, `memory-bank/techContext.md`
   - Tests first: `src/capture/funnel.test.ts` (classifyPage Tonal/Shopify/Shop.app URLs; paid-URL / thank-you guards if extracted or tested via exported helpers); `src/capture/resolve.test.ts` (`PAYMENT_SUBMIT` yes/no cases)
   - Changes: add `"test": "tsx --test src/**/*.test.ts"`; export any guard that must be unit-tested rather than re-implementing regexes in the test file; surgical techContext Testing Process pointer to `npm test`

1b. [x] Add a structured payment-UI evidence signal (accretive to AC1 — makes "checkout shows payment fields" machine-checkable, not just a screenshot a human/Grok must eyeball)
   - Files: `src/types.ts`, `src/capture/evidence.ts`, `src/capture/evidence.test.ts`
   - Tests first: `src/capture/evidence.test.ts` — stub a `Page`-like object whose `frames()` returns objects with `.url()`; assert `detectPaymentUi` returns `true` for a frame URL matching known payment-iframe hosts (`checkout.shopify.com`, `js.stripe.com`, `paypal.com`, `braintreegateway.com`, `adyen.com`) and `false` when no frame matches
   - Changes: add `paymentUiDetected: boolean` to `StageEvidence` in `src/types.ts`; add `detectPaymentUi(page: Page): Promise<boolean>` in `src/capture/evidence.ts` checking `page.frames().some(f => PAYMENT_IFRAME_HOST.test(f.url()))`; wire it into `captureStage`'s returned object. This is evidence collection (like `collectCtas`/`collectForms`), not judging — stays on the walker side of the walker/judge split

2. [x] Install capture toolchain
   - Files: none in git (`node_modules/`, Playwright browsers)
   - Tests first: N/A for prose & policy artifacts
   - Changes: `npm ci` and Playwright Chromium install so the live walk can run

3. [x] Run the existing walker against Tonal
   - Files: `runs/` (gitignored)
   - Tests first: N/A for prose & policy artifacts
   - Changes: `HEADLESS=1 npm run capture -- https://tonal.com/ --run-id tonal-walk --delay-ms 800`; keep the full log; record each stage URL and interaction

4. [x] Close heuristic gaps that the live run exposes
   - Files: `src/capture/resolve.ts`, `src/capture/funnel.ts`, `src/capture/overlays.ts` (only the hop that failed)
   - Tests first: add a failing case in `src/capture/resolve.test.ts` or `src/capture/funnel.test.ts` for that hop (selector/URL/intent), then implement the smallest fix
   - Changes: likely candidates — prefer `/products/tonal-2` (or hardware) over accessory/rent links; dismiss Tonal-specific overlays; treat Shop.app / Shopify hosted checkout as checkout; do not fill email/address/card; do not click `PAYMENT_SUBMIT`

5. [x] Re-run capture until the path is honest
   - Files: `runs/` (gitignored)
   - Tests first: N/A for prose & policy artifacts
   - Changes: successful bundle or an honest failure at a named hop; checkout must not be the landing URL; `stoppedBeforePayment` stays true; no payment-complete page

6. [x] Publish the recorded step sequence
   - Files: `docs/visual-explainer/tonal-funnel-walk.html`
   - Tests first: N/A for prose & policy artifacts
   - Changes: visual explainer of the actual hop sequence (stage, action, URL, what we saw, where we stopped, whether `paymentUiDetected` fired on the checkout stage). Facts only from the live bundle/screenshots. Do not overwrite an existing page. Leave `docs/index.html` alone.

## Technology Validation

No new runtime technology. `node:test` is in Node 22. Playwright is already in `package.json`. Validation during build: `npm test` and a live `npm run capture` against Tonal.

## Dependencies

- Live `https://tonal.com/` (Shopify storefront)
- Playwright Chromium
- Node 22 + `tsx` (already used by `capture` / `score`)

## Challenges & Mitigations

- [No test runner today]: add `node:test` via `tsx --test`; do not add Jest/Vitest
- [Email wall before card fields]: stop on that checkout page; do not type email; the sequence still counts as reaching checkout
- [Rental CTA steals the hop]: keep skipping `purchase_type=rent`; click "Add to cart" on `/products/tonal-2`
- [Bot / overlay / flaky live site]: dismiss overlays; retry the failed hop once; if still blocked, fail honestly with the last URL
- [robots.txt disallows checkout URLs]: we are a shopper click-through, not a crawler of `/checkout`; do not add UCP/MCP as a bypass
- [Card fields in iframes]: judge success from the checkout screenshot and visible "payment" / card chrome, not from `collectForms` alone

## Pre-Mortem

- [We screenshot a cart drawer and call it checkout]: require `classifyPage` of the last stage to be `"checkout"` and a different URL than landing
- [We type email to reveal card fields]: already covered by Challenge "Email wall" — stop, do not type
- [We switch to UCP/MCP because Playwright is hard]: wrong product; stay on the walker
- [We hard-code a Tonal-only scraper]: prefer one or two heuristic gaps; if Tonal needs a unique pipeline, that is a re-level signal — do not invent a second walker

## Status

- [x] Initialization complete
- [x] Test planning complete (TDD)
- [x] Implementation plan complete
- [x] Technology validation complete
- [x] Pre-Mortem complete
- [x] Preflight (PASS WITH ADVISORY)
- [x] Build
- [x] QA (PASS)
- [x] Reflect

## QA Result

✅ PASS

- No blocking findings. The implementation covers the planned URL classification, cart fallback, payment-stop guards, payment UI evidence, rent-link avoidance, and live Tonal hop sequence.
- Advisory: `src/capture/funnel.ts` has an orphaned duplicate JSDoc block immediately before `storeCartUrl`; this is documentation debris with no behavior impact and does not block acceptance.
- Verification evidence: `npm test` passed all 14 tests; `npx tsc --noEmit` passed; `runs/tonal-walk-3/bundle.json` records landing → product → `/cart` → checkout with `paymentUiDetected: true` and `stoppedBeforePayment: true`.

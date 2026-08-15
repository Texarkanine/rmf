---
task_id: tonal-funnel-walk
date: 2026-08-15
complexity_level: 2
---

# Reflection: tonal-funnel-walk

## Summary

The Playwright walker can take `https://tonal.com/` from homepage through a real cart to Shopify checkout with empty credit-card fields, then stop. The hop sequence is in `docs/visual-explainer/tonal-funnel-walk.html`.

## Requirements vs Outcome

Delivered: live walk, recorded steps, card fields visible, no PII or payment entered. Added `npm test`, `paymentUiDetected`, and a `/cart` fallback the brief did not name but the first live run required.

## Plan Accuracy

The plan guessed rental CTAs and an email wall. The real miss was AJAX add-to-cart plus a cart drawer that never changes the URL, so the first run graded the PDP as cart. Card fields were already on checkout page load; we did not need to type email.

## Build & QA Observations

Three live captures. Unit tests stayed green. QA passed with one JSDoc advisory, now fixed.

## Insights

### Technical
- Shopify “in cart” on the PDP is not a cart page. Assert on URL class, then fall back to `/cart` on the same origin when the drawer does not navigate.
- Tonal checkout paints card chrome in the main document. Iframe-host detection alone was a false negative.

### Process
- Run the live walk before tightening assertions. The first successful-but-dishonest cart stage was the useful failure.

### Million-Dollar Question

Treat cart the way checkout was already treated: click, then origin-relative fallback (`/cart`, `/checkout`). The rest of the walker can stay heuristic. Nothing notable beyond that.

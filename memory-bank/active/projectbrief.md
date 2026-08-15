# Project Brief

## User Story

As a hackathon operator, I want to know whether the Playwright walker can take `https://tonal.com/` from the homepage through checkout far enough to see credit-card fields, so we have a recorded step sequence and proof we stop before entering payment.

## Use-Case(s)

### Use-Case 1

Run the existing capture walker against Tonal and record the hop sequence (URL + action) from landing through checkout.

### Use-Case 2

If a hop fails, harden the walker just enough to finish that Tonal path, still stopping before any personal information or payment is entered.

## Requirements

1. Work on a branch off `main`.
2. Inspect the current Playwright funnel-walking path (`src/capture/`).
3. Walk `https://tonal.com/` as a shopper: destination → product if needed → cart → checkout.
4. Produce a sequence of the steps that were taken.
5. Reach the page where credit-card / payment fields are visible.
6. Stop before entering payment or any personal information.

## Constraints

1. No email, address, phone, or card. Do not invent a card. Do not submit payment.
2. Reaching a payment-complete or thank-you page is a failure.
3. Playwright records; it does not grade. Do not mix walker and judge.
4. Login walls before cart are out of scope; account walls at checkout are in (screenshot and stop).
5. Do not build a public web app for this ship.

## Acceptance Criteria

1. A live walk of `https://tonal.com/` reaches a checkout page that shows payment / card fields, or the run fails honestly at the hop that blocked it.
2. The run writes a step sequence (stage name, URL, action) that a human can follow.
3. The walker does not type into payment or PII fields and does not submit payment.
4. `stoppedBeforePayment` remains true on a successful bundle.

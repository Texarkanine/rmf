# Product Context

Definitional orientation for Roast My Funnel. The product spec lives in [`prd.md`](../prd.md); this file does not restate it. [`product-brief.md`](../product-brief.md) is superseded wherever the two disagree. As the product is built, reconciliation updates this file only when the *product* picture changes — not when a pipeline step ships.

## Target Audience

A business owner or performance marketer auditing **their own** paid funnel. Not an agency operator roasting a client. Not a random visitor of a public roastmyfunnel.com (that is a later product story).

## Use Cases

- In one sitting, see whether ads, the click-through page, the product page, cart, and checkout tell the same story.
- Get a short, opinionated roast of *this* funnel — with receipts — instead of a slow agency CRO deck or an ad-only spy tool.
- Leave with a starting-point landing-page image that matches the ad they actually run, for their own team to adapt.

The hackathon demo is one blessed store/ad pair. “Any URL” is the product story; that pair is the demo. Details are in `prd.md`.

## Key Benefits

- One number and four buckets instead of a 20-page memo.
- Roast the **gaps** (mismatch, buried price, generic homepage leftover) — not the brand, the company as people, or the customers.
- A shareable v1 landing-page mock next to the primary ad / destination gap.
- Judges (and the marketer) open a short walk video and the report-card write-up. There is no live SaaS to click during judging.

## Success Criteria

After one run, the marketer can do what `prd.md` lists under **What success looks like**: Funnel Score 0–100, a light Kill Tony roast of the gaps, a clear picture of where messaging and creative break, and a v1 landing-page image mock.

Grok 4.6 must **score and roast**, not only have been used to write code.

## Key Constraints

- **Meta is the only live ad path.** Other platforms may appear in a UI as visible and disabled.
- Spend is roast intensity, not a crawl or ROAS model.
- Ads are operator-provided (one required, more optional). The product does not auto-discover “top ads.”
- Video ads are graded from frames + copy. Audio transcription and scene-as-movie analysis are out of scope for this ship.
- Stop before any personal information. Do not submit payment. Do not invent a card.
- Login walls before cart are out of scope; account walls at checkout are in.
- Capture stays a CLI / agent run. Do not build a public web app for this ship.
- The write-up is a visual report card, not a long memo. Do not include an Ad Library chrome screenshot.

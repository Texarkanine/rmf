# Report layout

The report card is the product the marketer reads. Visual canvas, not a memo. Authority: `prd.md` write-up and Funnel Score sections.

Output file: `<workdir>/report.html`. One HTML document.

## Required on-disk inputs

Read these when they exist. A missing file is a gap on the card, not a reason to invent facts.

| Path | Role |
| --- | --- |
| `funnel.json` | Funnel URL and ads handoff |
| `ads.json` | Retrieved ads when present |
| `walk/steps.json` | Hop list and screenshot paths relative to `walk/` |
| `analysis/creative.md` | Creative bucket |
| `analysis/landing.md` | Message-match bucket |
| `analysis/add_to_cart.md` | On-site (PDP) |
| `analysis/cart.md` | On-site (cart) |
| `analysis/checkout.md` | Checkout bucket |
| `analysis/lp-mock.md` | V1 LP brief |
| `walk/artifacts/*` | Journey receipts |
| `media/*` | Ad creatives and `lp-mock.png` when present |

## Canvas

- **Ad cluster** — one tile per pasted ad: frames or thumb, copy, creative grade, destination URL. No Ad Library chrome screenshot.
- **Journey cluster** — destination, PDP, cart, checkout. Shared destination URLs get one tile; ads point at it. PDP, cart, and checkout each appear once.
- **Roast on the tiles** — short jabs on the gaps. Lighthearted. Punch the mismatch, the buried price, the leftover generic homepage. Do not punch the brand's customers or the company as people.
- **Score** — one Funnel Score 0–100 and four bucket numbers, visible on the card. Weights: creative 30, message match 30, on-site 20, checkout 20. Cart rolls into on-site. Average creative when several ads exist. Message match is N/A when no ad was retrieved; do not invent a number to fill the hole — show the miss and roll the other buckets honestly.
- **V1 LP mock** — the generated still, next to the primary ad / destination gap. Omit when `media/lp-mock.png` is not on disk.

## Tone

Kill Tony of the funnel. Specific, funny, slightly mean about the *gap*. Consultant-useful.

## Cite

Every grade and every roast line points at a workdir-relative artifact path that exists. Do not invent pages, CTAs, or errors.

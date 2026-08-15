# Hop skills

Rubric map for a roast run. Corey Haines [marketingskills](https://github.com/coreyhaines31/marketingskills) names the skill. This file states the invert: score what exists; do not generate ads or rewrite the live site.

If `skills/<name>/SKILL.md` is not on disk, follow this map anyway. Do not skip the hop. Do not fetch the upstream repo.

If the hop artifact is not the intended page (bot wall, challenge, interstitial, blank chrome, leftover previous page), do not write that hop's analysis and do not invent a score. That is a walk failure, not a skip-with-a-score. Stop as `walk-the-funnel` and `start-the-roast` require. Telling the operator that analysis cannot be completed is better than roasting the wrong page.

Findings cite artifact paths that exist under the workdir. Do not invent pages, CTAs, copy, or errors. Do not browse. Do not call `npm run score`.

## Paths

`steps.json` lives at `<workdir>/walk/steps.json`. Screenshot values inside it are relative to `<workdir>/walk/` (example: `artifacts/landing.png` is `<workdir>/walk/artifacts/landing.png`). Cite the workdir-relative path (`walk/artifacts/landing.png`).

Ad media paths in `funnel.json` / `ads.json` are already workdir-relative.

## Map

| Artifact | Skill | Rubric mode | Output |
| --- | --- | --- | --- |
| Retrieved ad (`ads.json` / `funnel.json` ads) | `ad-creative` | Invert: hook, offer, visual, CTA from frames + copy | `analysis/creative.md` |
| `landing` hop | `cro` | Message match: ad promise vs the destination page. Paid-funnel mismatch logic lives here, not in Corey's skill. | `analysis/landing.md` |
| `add_to_cart` hop | `cro` | On-site: value prop, CTA, hierarchy, proof, objections, friction | `analysis/add_to_cart.md` |
| `cart` hop | `cro` | On-site. Cart is not its own score bucket. | `analysis/cart.md` |
| `checkout` hop | `cro` | Checkout friction: surprises, required commitment, trust, field load. Stop before PII. | `analysis/checkout.md` |
| After `analysis/landing.md` exists | `copywriting` + `image` | Single-purpose LP that continues the primary ad: hook, offer, proof, CTA. Still image, not HTML. | `analysis/lp-mock.md` and `media/lp-mock.png` when an image file lands |

## Empty or missing ads

Write `analysis/creative.md` that records the miss. Do not invent an ad. Message-match on `landing` is N/A. Still walk. Still write the other hop files. Still draft the LP mock from `funnel.url` only, and say the ad was missing.

## Analysis file

Each `analysis/*.md` file includes:

- The artifact or hop name
- The skill and rubric mode from the map
- The score bucket (`creative` / `message_match` / `on_site` / `checkout`) and a 0–100 subscore
- A one-line roast of the gap
- Findings that each cite an existing workdir-relative path

Omit `media/lp-mock.png` from `analysis/lp-mock.md` when that file is not on disk.

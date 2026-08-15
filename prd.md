# Roast My Funnel — Product Requirements
**Status:** Source of truth  
**Date:** 2026-08-15  
**Origin:** Grilling session (hackathon team: Jesse, Brian Oliver, Ryan, Austin)  
**Build repo:** [Texarkanine/rmf](https://github.com/Texarkanine/rmf)  
**This file supersedes** `product-brief.md` in rmf wherever they disagree.
Copy this document into `Texarkanine/rmf` as `PRD.md` (or replace `product-brief.md`) so the team works from one spec.
---
## Problem
A DTC marketer or founder is spending real money on paid social. They cannot see, in one sitting, whether their **ads**, **click-through page**, **product page**, **cart**, and **checkout** tell the same story. Agency CRO decks are slow and polite. Spy tools show ads, not the path after the click.
They need a short, opinionated roast of *their* funnel — with receipts — and a starting-point landing page that matches the ad they actually run.
## Who it is for
A **business owner or performance marketer** auditing **their own** paid funnel. Not an agency operator roasting a client in this version. Not a random visitor of roastmyfunnel.com (that is the later product story).
## What success looks like
After one run they can:
1. See a **Funnel Score from 0–100** (four buckets).
2. Read a **light Kill Tony roast of the gaps** (the funnel, not the brand or the customers).
3. See **where messaging and creative break** between ad and page.
4. Leave with a **v1 landing-page image mock** matched to their primary ad — a shareable starting point for their own team, not a coded site.
Judges (and the marketer) open two things: a **short walk video** and this **report-card write-up**. There is no live SaaS they click during judging.
---
## Demo (hackathon)
| Item | Decision |
| --- | --- |
| Event | Cursor Austin Grok 4.6 Hackathon — 15 Aug 2026 |
| Submit | 3:00 PM CT — demo video ≤ 3 min + write-up |
| Judging | Works 40 / Taste 30 / Business 30. Grok 4.6 must **score and roast**, not only have been used to write code. |
| Store | [tonal.com](https://tonal.com/) |
| Primary ad | [Meta Ad Library `2110273689844971`](https://www.facebook.com/ads/library/?id=2110273689844971) |
| Known miss | Tonal’s top video ads dump to the **homepage**. The video’s content is not on that page. |
| Crawl | **Live** against Tonal. Ryan owns Playwright. No silent fallback tape. |
| Brand | New concept (not Red Beard Conversions). |
“Any URL” is the product story. **This Tonal pair is the demo.**
---
## Inputs
The operator provides:
1. **Store / start URL** (required). Demo: `https://tonal.com/`.
2. **Ad platform** (required). **Meta is the only live path.** Google Ads and TikTok Ads appear in the UI as **visible and disabled**.
3. **Monthly ad spend** (required). A range selector. Spend does not change what we crawl. It changes roast intensity (“you’re lighting $X/mo and the homepage still ignores the ad”).
4. **Ads they care about** — **one required, more optional.** Each is a Meta Ad Library link (or equivalent saved creative). We do **not** auto-discover “top 5 by impressions.” If they paste several, we grade each creative and **dedupe shared pages**.
---
## Pipeline
Background magic. The operator does not watch a mouse. The write-up is the receipt.
### 1. Save each provided ad
For every pasted ad:
- Capture **placement**, **image vs video**, **primary text / headline / CTA**, **destination URL**.
- Do **not** show an Ad Library chrome screenshot in the report.
**Video ads:** Grok does **not** generate or “watch” a video as a movie. Grade from **frames + copy**:
- Play the ad in Ad Library (Playwright).
- Screenshot multiple frames (e.g. start / ~3s / ~8s / last).
- Read overlay text from the DOM when present.
- Grok describes what the frames are doing and grades hook, offer, visual, CTA from that plus the static copy.
Audio transcription and Higgsfield scene analysis are **out of scope for this ship**. (Higgsfield may still generate the LP **image** mock.)
### 2. Click through the primary ad
Follow **whatever URL the ad actually opens** — homepage, PDP, or a dedicated LP. Grade **that** page. Do not assume homepage. For Tonal, it is the homepage; that is the roast.
If several ads share a destination, **walk that URL once**.
### 3. Consumer journey (one path)
From that destination, act like a shopper trying to place an order:
1. Destination page (home / LP / PDP — whatever the ad hit)
2. Product page if not already there (Tonal: Shop → Tonal 2)
3. Add to cart
4. Cart
5. Checkout **page load only**
**Stop before any personal information.** No email, address, phone, or card. Do not submit payment. Do not invent a card. Account walls **at checkout** are in scope (screenshot and roast). Login walls **before** cart are out — skip or fail that hop honestly.
Tonal specifics: hardware + membership + install will show up as line-item surprises. Roast those. Do not complete checkout.
### 4. Grade (Grok 4.6, load-bearing)
Playwright only walks and captures. **Grok judges.**
Use Corey Haines [marketingskills](https://github.com/coreyhaines31/marketingskills) as the **rubric brain**, not as an interview:
| Bucket | Skill |
| --- | --- |
| Creative | Invert `ad-creative` (hook, offer, visual, CTA). The skill generates ads; we use its quality bar to **score** existing ones. |
| Message match | `cro` — headline vs traffic source; landing-page “message match with traffic source.” This skill does **not** ship a paid-funnel matcher; mismatch logic lives in **this** product. |
| On-site | `cro` — value prop, CTA, hierarchy, proof, objections, friction on destination + PDP + cart. |
| Checkout | `cro` friction / form sense — surprises, required commitment, trust, field load. Stop before PII. |
`copywriting` + `image` draft the replacement LP mock.
### 5. Generate the v1 LP mock (live)
After the destination is graded (Tonal: homepage does not match the video ad):
- Grok + `copywriting` drafts a **single-purpose landing page** that continues the **primary ad** (first / required ad): hook, offer, proof, CTA.
- Produce a **still image mock** (not HTML, not a coded page). Generate it **during the run**.
- The mock is a starting point their team will adapt. Easy to share.
Brian owns taste/art direction of that mock. Higgsfield / `image` skill are allowed as the generator. Do not ship a full tonal.com redesign.
---
## Funnel Score
One number, **0–100**, four buckets:
| Bucket | Weight | What it scores |
| --- | --- | --- |
| **Creative** | **30** | Each provided ad, from frames + copy. Average if multiple ads. |
| **Message match** | **30** | Ad promise vs the actual destination page. |
| **On-site** | **20** | Destination (if not already in match), PDP, cart — friction and clarity. Shared pages counted **once**. |
| **Checkout** | **20** | Checkout page only. Surprises, trust, commitment, field load. |
Cart is **on-site**, not its own bucket.
**Replace** the current rmf 8-dimension letter grades (`message_match`, `value_proposition`, `cta`, `friction`, `trust`, `mobile`, `performance`, `errors`) and the current stage weights (landing 30 / ATC 25 / cart 20 / checkout 25). Those are not this product.
Each bucket gets a numeric subscore that rolls into 100, plus a one-line roast.
---
## Write-up (the report card)
This is the product the marketer (and judges) read. Visual canvas, not a 20-page memo.
### Layout
- **Ad cluster** — one tile per pasted ad: frames/thumb, copy, creative grade, destination URL.
- **Journey cluster** — destination, PDP, cart, checkout.
- **Shared pages are unique.** If ad 1 and ad 2 both hit the homepage, **one homepage tile**, two ads pointing at it. PDP, cart, and checkout are each graded **once**.
- **Roast copy lives on the canvas** — short jabs on the gaps, not a separate essay at the bottom. Lighthearted. Punch the mismatch, the buried price, the leftover generic homepage. Do not punch Tonal’s customers or dunk on the company as people.
- **Score** — 0–100 plus the four bucket numbers, visible on the report card.
- **V1 LP mock** — the generated image, next to the primary ad / destination gap.
Do **not** include an Ad Library UI screenshot.
### Tone
Kill Tony **of the funnel**. Specific, funny, slightly mean about the *gap*. Consultant-useful, not a random reply-guy.
---
## What judges open
1. **Demo video** (≤ 3 min) — the live walk / receipts, cut for clarity. Grok is not “making a video” as a product feature; this is the hackathon tape.
2. **This write-up** — HTML report card from the run.
Capture stays a **CLI / agent run** in rmf (`capture` then `score` / report). Do not build a public roastmyfunnel.com web app for this ship.
---
## What already exists in rmf (do not throw away)
The repo already walks a URL with Playwright and scores offline with Grok 4.6:
- `capture <url>` — landing → product → cart → checkout; stop before payment; screenshots + bundle.
- `score <run>` — Grok reads the bundle; writes `report.json`.
- `product-brief.md` — older brief. **This PRD wins** on inputs (user-provided ads, not only `--ad` text), score (four buckets), output (report card + live LP mock), and video-ad handling (frames + copy).
Keep: walker, overlay dismiss, stop-before-payment guards, evidence bundle, Grok-as-judge (offline on evidence).
Change: ad intake (Library links, one required / more optional), video frame capture, four-bucket score, report-card HTML, live LP image, roast voice, platform/spend as roast context, shared-page dedupe.
---
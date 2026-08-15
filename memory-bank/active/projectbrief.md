# Project Brief

## User Story

As an operator starting a roast from a direct Meta Ad Library link, I want `/start-the-roast` to collect only the ad in that `?id=` URL so a bot-blocked page that falls back to a browser does not harvest sibling ads.

## Use-Case(s)

### Direct library link

The operator pastes `https://www.facebook.com/ads/library/?id=2110273689844971` (or another `id=` library URL). The skill writes at most that one ad into `funnel.json`, even when the rendered page lists other ads or a browser subagent is used because raw HTTP was blocked.

### Library search or page set

The operator pastes a library URL with no `id` query parameter. Existing behavior stands: extract every ad that page yields.

## Requirements

1. Detect a non-empty `id` query parameter on the ads deeplink.
2. When `id` is present, extract only the ad whose platform id matches that value.
3. When a browser is used for a pinned link, stay on that URL. Do not click other library cards, "See more ads", advertiser pages, or search results.
4. If the pinned ad is not found, write `ads: []`. Do not substitute sibling ads.
5. Work on a branch off current `main`.

## Constraints

1. Prose change to the existing skill. No scraper package, no Marketing API, no helper script.
2. Do not change later roast pipeline steps.
3. TDD does not apply: this is skill wording, not executable behavior.

## Acceptance Criteria

1. `skills/start-the-roast/SKILL.md` pins collection to the `id` query value when that parameter is present.
2. Browser fallback instructions forbid exploring other ads on a pinned link.
3. A library URL without `id` still collects every ad the page yields.
4. `funnel.json` schema notes that a pinned deeplink yields at most one ad.

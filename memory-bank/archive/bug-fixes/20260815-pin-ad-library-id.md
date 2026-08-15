---
task_id: pin-ad-library-id
complexity_level: 1
date: 2026-08-15
status: completed
---

# TASK ARCHIVE: pin-ad-library-id

## SUMMARY

Pinned `/start-the-roast` so a Meta Ad Library URL with a non-empty `id` query parameter collects only that ad. A browser fallback after a bot-blocked HTTP fetch must stay on that URL and must not harvest sibling library cards.

## REQUIREMENTS

From the project brief:

- Detect a non-empty `id` query parameter on the ads deeplink.
- When `id` is present, extract only the ad whose platform id matches.
- Browser / subagent fallback stays on that URL. No other library cards, "See more ads", advertiser pages, or search results.
- If the pinned ad is not found, write `ads: []`. Do not substitute a sibling.
- A library URL without `id` still extracts every ad the page yields.
- Prose only. No scraper, Marketing API, helper script, or later pipeline changes.

## IMPLEMENTATION

Level 1, no plan / creative / preflight / reflect. Step 4 in [`skills/start-the-roast/SKILL.md`](../../../skills/start-the-roast/SKILL.md) now branches pinned vs set. The stay-on-URL rule is restated for browser helpers so it survives a subagent spawn. [`skills/start-the-roast/references/funnel-json.md`](../../../skills/start-the-roast/references/funnel-json.md) notes that a pinned deeplink yields at most one ad. Step 5 repeats the at-most-one rule.

Pin key is the `id` query parameter only. `view_all_page_id` and search URLs stay sets.

## TESTING

No automated tests — TDD carve-out for skill wording.

- Build: two files edited; no linter or package to run for the skill itself.
- `/niko-qa` (Grok): `PASS`. Advisories (repeated extract field list; stay-on-URL sentence gated on HTTP-blocked) did not block.
- Persistent reconcile: productContext, systemPatterns, and techContext left unchanged. Ads-are-inputs was already the briefing.

## LESSONS LEARNED

- "Extract every ad the page yields" is wrong for a single-id Ad Library URL. Meta still renders sibling cards on that page.
- Parent-skill constraints do not travel into a browser subagent. Restate the target id and stay-on-URL rule at spawn time.

## PROCESS IMPROVEMENTS

- Level 1 has no archive phase. This archive exists because the operator invoked `/niko-archive` after wrap-up.
- Preflight is not in the Level 1 map; skipping it was correct for a two-file wording fix.

## TECHNICAL IMPROVEMENTS

None. The pin rule is skill-internal. "Ads are inputs, not discoveries" already covers system-pattern altitude.

## NEXT STEPS

None for this task.

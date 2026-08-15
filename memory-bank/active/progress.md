# Progress

Tighten `/start-the-roast` so a Meta Ad Library URL with `?id=` collects only that ad, including when fetch falls back to a browser.

**Complexity:** Level 1

## 2026-08-15 - COMPLEXITY-ANALYSIS - COMPLETE

* Work completed
    - Confirmed the skill on `origin/main` (`skills/start-the-roast`) is the entrypoint the operator called start-the-funnel.
    - Classified as Level 1: isolated wording fix in one skill.
* Decisions made
    - Pin only when the deeplink has a non-empty `id` query parameter. Search and page-set URLs keep current "every ad the page yields" behavior.
    - Skip `/niko-preflight` (not in the Level 1 map). Use Grok for `/niko-qa`.
* Insights
    - The over-collection is the Step 4 instruction plus Meta showing sibling ads on a single-id page, not a missing scraper.

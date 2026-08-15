# Progress

Expand `/start-the-roast` so it sequences gather → Meta ad fetch → Playwright walk with per-hop marketing skills → final report. Skill/prose only.

**Complexity:** Level 3

## 2026-08-15 - COMPLEXITY-ANALYSIS - COMPLETE

* Work completed
    - Confirmed intent: full roast sequence on a branch off `main`
    - Recorded operator constraints: no unit tests; Composer 2.5 Fast for preflight and QA
    - Fast-forwarded `main` to include `get-meta-ad` and `walk-the-funnel`
    - Classified Level 3
* Decisions made
    - Level 3, not Level 2: more than a self-contained wording tweak; the entrypoint must hand off to walk, marketing skills, and a report
    - Level 3, not Level 4: do not rebuild capture/score; sequence existing skills and fill the missing orchestrator steps
* Insights
    - Current `skills/start-the-roast/SKILL.md` already gathers inputs and invokes `get-meta-ad`, then forbids later pipeline steps
    - `walk-the-funnel` is a one-shot CLI walk that writes `runs/<id>/steps.json`
    - Corey Haines marketingskills are not vendored in this repo

# Progress

Build a `start-the-funnel` entrypoint that calls an orchestrator. The orchestrator instructs Grok to load a live site, walk to checkout, apply selected marketingskills in subagents at each hop, and write a JSONL of step judgements.

**Complexity:** Level 3

## 2026-08-15 - COMPLEXITY-ANALYSIS - COMPLETE

* Work completed
    - Confirmed persistent memory bank; no active ephemeral state (Fresh).
    - Restated intent from the `/niko` build request and the prior `/nk-chat` walk-vs-Playwright discussion.
    - Classified Level 3.
* Decisions made
    - Level 3, not Level 4: one pipeline stage with several files, not a rewrite of capture/score.
    - `start-the-funnel` is a new product skill. It is not a rename of `start-the-roast`.
* Insights
    - `origin/main` already has `/start-the-roast`, which writes `.rmf/<timestamp>/funnel.json` and explicitly does not start later steps. This task is the next step that walk can call.
    - The standing walker/judge split in `systemPatterns.md` is Playwright-walk / Grok-offline. This task asks for Grok-walk with judgements in subagents. That is an intentional second path, not a silent replacement of `npm run capture`.

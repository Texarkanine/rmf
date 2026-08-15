# Progress

Build `skills/start-the-roast` so an operator can hand in a funnel and a Meta ads deeplink and get back a timestamped run directory containing `funnel.json` (and retrieved ad media when available) for later roast steps.

**Complexity:** Level 3

## 2026-08-15 - COMPLEXITY-ANALYSIS - COMPLETE

* Work completed
    - Restated and confirmed intent
    - Wrote ephemeral memory-bank files
    - Classified the task as Level 3
* Decisions made
    - Level 3: complete feature with multiple components (skill, run folder, ad spec, media paths) and design choices before implementation
    - Not Level 2: cannot start coding immediately; retrieval approach and `funnel.json` schema need a plan
    - Not Level 4: scope is the entrypoint skill, not a system-wide roast architecture
* Insights
    - Slobac's run pattern is the persistence reference: `.slobac/<ISO-8601 seconds>/` with optional `--workdir`

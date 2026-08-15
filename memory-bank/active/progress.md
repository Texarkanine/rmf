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

## 2026-08-15 - PLAN - COMPLETE

* Work completed
    - Component analysis, open questions, TDD carve-out, implementation steps, pre-mortem
    - Recorded operator constraint: prose only, no unit tests
* Decisions made
    - Product skill under `skills/start-the-roast`, not imported `.cursor/skills/`
    - Run parent is `.rmf/` (product name, slobac layout); `--workdir` override
    - `funnel.json` schema in `references/funnel-json.md`; media paths only when files exist
    - Agent-mediated fetch; no API client or test suite
* Insights
    - The hard part is a stable on-disk contract, not code. A schema reference is the lock.

# Task: start-the-roast-sequence

* Task ID: start-the-roast-sequence
* Complexity: Level 3
* Type: feature

Expand `/start-the-roast` from intake-only (stop after `funnel.json`) into the roast orchestrator: gather → `/get-meta-ad` → Playwright walk with a marketing-skill analysis at each hop → final report.

## Open Questions

- [x] How should the orchestrator hand off the walk, per-hop marketing skills, and the report? → Resolved: one-shot `/walk-the-funnel`, local hop → skill map, `/write-the-roast` (see `memory-bank/active/creative/creative-orchestrator-handoffs.md`)

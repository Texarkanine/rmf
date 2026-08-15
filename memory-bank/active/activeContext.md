# Active Context

## Current Task: start-the-funnel
**Phase:** QA - COMPLETE (FAIL)

## What Was Done
- Wrote `skills/funnel-walk-orchestrator/references/walk-jsonl.md` and `skill-map.md`.
- Wrote `skills/funnel-walk-orchestrator/SKILL.md` (walk loop) and `skills/start-the-funnel/SKILL.md` (resolve + handoff).
- README "Walk the funnel" section.
- Surgical updates: `productContext.md` (agent-walk use case), `systemPatterns.md` (parent-walks / subagents-judge, second capture path, `walk.jsonl`).
- QA reviewed all six deliverables against the plan. One blocking finding: the `ads_present` signal is documented and computed but never wired to a recording instruction in the hop loop (see `tasks.md` QA Findings).

## Next Step
- Build must rerun to add the missing `ads_present` recording clause in `skills/funnel-walk-orchestrator/SKILL.md` (4a/4b) and reconcile 4c's "signals from 4a–4b" phrasing, then re-run QA.

---
task_id: start-the-roast
date: 2026-08-15
complexity_level: 3
---

# Reflection: start-the-roast

## Summary

Shipped `skills/start-the-roast`: a prose workflow that collects a funnel URL and a Meta ads deeplink, writes a slobac-style `.rmf/<timestamp>/` folder with `funnel.json` (and media when it lands), and prints that path. QA passed. No tests, no retrieval library — as requested.

## Requirements vs Outcome

All five brief requirements and five acceptance criteria are in the skill and schema. Nothing was descoped. The preflight screenshot-fallback advisory was not added; `/niko-build` did not ask for it.

## Plan Accuracy

The five-step file list was right: `.gitignore`, schema reference, `SKILL.md`, README, `productContext.md`. No reordering, no extra files. The challenges that mattered (JS-heavy Ads Library, invented media paths) were already in the plan; build did not hit a new one.

## Creative Phase Review

No creative phase ran. The operator's "prose only" constraint and the slobac run pattern resolved the open questions inside plan. That was enough; a design doc would have restated the same three decisions.

## Build & QA Observations

Build was a straight write of the planned prose. QA passed with no findings. The useful split was `SKILL.md` (order) vs `references/funnel-json.md` (shape).

## Cross-Phase Analysis

Preflight's only fix was a stale `productContext.md` bullet that the README step would invalidate. That is the kind of cheap catch preflight is for. Planning did not leave a hole that build had to invent around. Skipping creative did not produce a QA miss.

## Insights

### Technical

- Product skills live under `skills/`, not `.cursor/skills/`. The on-disk contract is `.rmf/<timestamp>/funnel.json`; media `path` exists only when the file does. A schema reference plus a required read-before-write is how an agent-written file stays stable without a validator.

### Process

- "Prose only, no unit tests" collapsed the executable-vs-skill question immediately. For a two-file skill, L3 still paid for the schema lock and the preflight stale-doc catch; it did not need a creative loop.

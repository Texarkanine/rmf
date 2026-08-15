---
task_id: start-the-funnel
date: 2026-08-15
complexity_level: 3
---

# Reflection: start-the-funnel

## Summary

Shipped `/start-the-funnel` and `funnel-walk-orchestrator`: a real-browser walk to checkout that applies allowlisted marketingskills in subagents and writes `walk.jsonl`. First QA failed on an unwired `ads_present` signal; the rework passed.

## Requirements vs Outcome

All six brief requirements landed. The entrypoint calls the orchestrator. The orchestrator instructs a live walk to checkout page-load, selects from a closed marketingskills set, judges in subagents, and appends JSONL. Playwright capture and offline score were not replaced. No report card, Funnel Score, or LP mock was added.

## Plan Accuracy

The file list and prose-only carve-out were right. Preflight's three amendments (standalone workdir, JSONL example, "second capture path" wording) were the useful plan fixes. The surprise was not architectural: a schema key (`ads_present`) had a source in Step 2 and an example line, but no "record when" clause in the hop loop.

## Creative Phase Review

No creative phase. The start-the-roast pattern plus the operator's walk + subagent-judge spec was enough. That still holds.

## Build & QA Observations

Build was a straight write of two skills and two references. QA's first pass caught a real contract hole, not style. The fix was two sentences. Second QA (different model family) passed.

## Cross-Phase Analysis

Skipping creative did not create the QA miss. Preflight checked conventions and completeness of *steps*, not whether every schema flag had a matching record instruction. That gap sat between plan (schema lists `ads_present`) and build (only overlay / account_wall / priced_offer got "Record X when Y").

## Insights

### Technical
- A signal computed at resolve time is not recorded until the hop loop says "Record `ads_present` when …". Schema + example + Step 2 is not enough for an agent following numbered hop steps.
- Parent-walks / subagents-judge is how the walker/judge split survives when Grok is the one in the browser.

### Process
- For a JSONL/schema skill, preflight should check each optional field has a write instruction in the workflow, not only that the schema file exists.
- Mixing preflight/QA model families (Composer, then Sonnet, then Gemini) produced one blocking find and a clean re-pass. Worth keeping.

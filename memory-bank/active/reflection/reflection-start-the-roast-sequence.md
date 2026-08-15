---
task_id: start-the-roast-sequence
date: 2026-08-15
complexity_level: 3
---

# Reflection: start-the-roast-sequence

## Summary

`/start-the-roast` now sequences gather → `/get-meta-ad` → ad-creative invert → `/walk-the-funnel` → per-hop `cro` → LP mock → `/write-the-roast`. The build matched the plan. QA passed with documentation advisories only.

## Requirements vs Outcome

Delivered the approved sequence. Intake steps 1–5 stayed. Ad fetch remains an execution handoff. The walk is the CLI, not an agent clicker. Each hop has a named rubric and an `analysis/` file. The report is `report.html` in the workdir. No unit tests. No capture or score code.

Nothing dropped. Added `report-layout.md` from the preflight advisory. Did not vendor Corey's skills and did not call `npm run score`, per the creative decision.

## Plan Accuracy

File list and scope were right. The one sequence mismatch was a leftover test-plan bullet that said walk starts right after `funnel.json`; the mermaid, creative doc, and skill put creative invert first. QA flagged that as a non-blocking advisory.

Identified challenges (walk failure, missing Corey skills, leftover intake-only wording, `outDir/runId`) were the real ones. No surprise dependency.

## Creative Phase Review

One-shot walk + local hop map + report skill held up. The invert-not-vendor choice kept the diff to prose. Interleaving analysis with clicks stayed off the table, so the walker/judge split never came under pressure.

Friction was small: `walk-the-funnel` still prints `steps.json` to chat. The orchestrator has to say "read the file" at the walk step, or an agent will treat the paste as the handoff.

## Build & QA Observations

Build was a straight write of the five planned files. Existing capture tests stayed green (16/16). QA found no completeness or pattern gaps. Advisories were stale plan/README altitude, not missing steps.

## Cross-Phase Analysis

Preflight's `report-layout.md` advisory prevented the report skill from inventing a canvas. That is the cheap catch preflight is for.

The test-plan bullet that skipped creative invert was a planning leftover, not a build miss. Creative and the skill agreed; the bullet did not. Next time, rewrite behavior bullets when creative reorders the pipeline.

Fast-forwarding `main` before classify mattered. `#9` and `#10` already shipped `get-meta-ad` and `walk-the-funnel`. Without that fetch, the plan would have reinvented them.

## Insights

### Technical

- An orchestrator frontmatter that says "do not run later pipeline steps" will keep winning after you add those steps to the body. Re-derive the description when the skill changes shape.
- A sibling skill that prints JSON to chat is not a disk handoff. Name the file path at the invoke step.

### Process

- Preflight advisories that add a reference file (layout, schema) are cheaper than QA finding an improvised report.
- When creative reorders a pipeline, update the test-plan behavior bullets in the same pass. Stale bullets become QA noise.

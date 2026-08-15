# Project Brief

## User Story

As an operator roasting a live paid funnel, I want a `start-the-funnel` entrypoint that calls an orchestrator so Grok can load the site, walk to checkout, apply the right marketingskills in subagents at each hop, and leave a JSONL of step-by-step judgements.

## Use-Case(s)

### Use-Case 1

The operator (or `/start-the-roast`) has a funnel URL. They invoke `/start-the-funnel`. The orchestrator tells Grok how to open that URL in a real browser and walk destination → product if needed → cart → checkout page-load. At each hop it classifies the page, selects skills from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills), runs those skills in subagents, and appends a JSONL record of `skill : judgement` for that page. When checkout is reached, the JSONL is complete.

### Use-Case 2

Playwright cannot be used (live bot defenses). The same orchestrator still produces the walk + judgements on a machine where Grok can drive a real browser.

## Requirements

1. Add a product skill `start-the-funnel` that can call into an orchestrator.
2. The orchestrator instructs Grok how to load the site and walk through to checkout.
3. At each step toward checkout, select the correct set of skills from https://github.com/coreyhaines31/marketingskills.
4. Apply those skills in subagents (the walker does not write the judgements itself).
5. Record the `skill : judgement` mapping for each step.
6. When checkout is reached, the run has a JSONL of each step along the way, with the judgements made against each page.
7. Work on a branch off `main`.

## Constraints

1. Stop before any personal information. Do not submit payment. Do not invent a card. (Standing product constraint from `prd.md` / `memory-bank/productContext.md`.)
2. Login walls before cart are out of scope; account walls at checkout are in (screenshot and judge, do not log in).
3. Product skills live under `skills/`, not `.cursor/skills/`.
4. Do not start from a silent fallback tape. This is a live walk.
5. Do not build the report-card HTML, Funnel Score rollup, or LP mock in this task.

## Acceptance Criteria

1. `skills/start-the-funnel` exists and calls into the orchestrator.
2. The orchestrator tells Grok how to load the funnel URL and walk to checkout page-load.
3. Each hop classifies the page and selects a defined set of marketingskills.
4. Selected skills run in subagents; their judgements are recorded as `skill : judgement`.
5. The run directory contains a JSONL of the sequence, one line per step, including judgements, when checkout is reached.
6. The walk stops at checkout page-load. Payment-complete or thank-you is a failure.

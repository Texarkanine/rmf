# Project Brief

## User Story

As an operator running a roast, I want `/start-the-roast` to sequence the full run — gather inputs, fetch the ad, walk the funnel with marketing-skill analysis at each hop, then write the report — so one invocation produces the roast instead of stopping after `funnel.json`.

## Use-Case(s)

### Use-Case 1

The operator invokes `/start-the-roast` with a funnel URL and a Meta Ad Library deeplink. The skill collects those inputs, establishes the run directory, invokes `/get-meta-ad`, walks the live funnel with Playwright, invokes the matching marketing skill at each hop, and produces the final report.

### Use-Case 2

A later session reads the printed run directory and finds the ad handoff, the walk artifacts, per-hop analysis, and the report already on disk.

## Requirements

1. Work on a branch off `main`.
2. `/start-the-roast` sequences, in order: gather info → invoke the Meta skill (`skills/get-meta-ad`) → Playwright funnel walk with the correct marketing skill at each hop → produce the final report.
3. Keep existing intake behavior: funnel URL + ads deeplink, writable `.rmf/<timestamp>/` (or `--workdir`), `funnel.json` schema.
4. Do not inline Ad Library fetch; that remains `/get-meta-ad`.
5. Playwright gathering uses the existing walker (`/walk-the-funnel` / `npm run capture`), not a live grading browser agent.
6. At each walk hop, invoke the matching Corey Haines marketing skill as rubric (PRD mapping: invert `ad-creative` for the ad; `cro` for destination / on-site / checkout; `copywriting` + `image` for the v1 LP mock).
7. Finish by producing the final report from on-disk evidence.

## Constraints

1. Prose / skill work only — no unit tests.
2. Preflight and QA run with Composer 2.5 Fast.
3. Walker does not judge. Grok / analysis skills read artifacts; they do not browse.
4. Stop before PII or payment. Do not invent a card.
5. Product skills stay under `skills/`. Do not put them under `.cursor/skills/`.
6. Ads are inputs, not discoveries. A pinned Ad Library `id` stays one ad.
7. Do not build a public web app. Do not replace the Playwright CLI with an agent-driven clicker.
8. Marketingskills is the rubric brain, not an interview. Paid-funnel message-match logic lives in this product.

## Acceptance Criteria

1. `/start-the-roast` no longer stops after printing the workdir; the later pipeline steps are required, in the order above.
2. Step 2 of the sequence is an execution handoff to `skills/get-meta-ad`, not an inline library scrape.
3. The Playwright walk is invoked as a skill/CLI handoff; chat output is not a substitute for `steps.json` / capture artifacts.
4. Each hop has a named marketing-skill invocation and a disk handoff for its findings.
5. A successful run leaves a final report in the run directory.
6. No new unit tests are added for this task.

# Task: start-the-roast-sequence

* Task ID: start-the-roast-sequence
* Complexity: Level 3
* Type: feature

Expand `/start-the-roast` from intake-only (stop after `funnel.json`) into the roast orchestrator: gather → `/get-meta-ad` → Playwright walk with a marketing-skill analysis at each hop → final report.

## Pinned Info

### Roast sequence

The orchestrator is a straight pipeline with hard stops. The chart is the map; the skill prose is the driving instructions.

```mermaid
flowchart LR
  gather["1 Gather"] --> meta["2 get-meta-ad"]
  meta --> funnel["3 funnel.json"]
  funnel --> creative["4 ad-creative invert"]
  creative --> walk["5 walk-the-funnel"]
  walk --> hops["6 Per-hop cro"]
  hops --> mock["7 copywriting + image"]
  mock --> report["8 write-the-roast"]
```

## Component Analysis

### Affected Components

- `skills/start-the-roast`: Intake orchestrator that stops after `funnel.json` → full sequence; frontmatter must allow later steps
- `skills/start-the-roast/references/hop-skills.md`: Does not exist → hop → skill → invert mode → analysis path
- `skills/write-the-roast`: Does not exist → assemble the PRD report card from disk
- `skills/get-meta-ad`: Ad Library fetch → no behavior change; invoked as today
- `skills/walk-the-funnel`: One-shot Playwright capture → invoked with `--out <workdir> --run-id walk`
- `README.md`: "Start a roast" still describes intake-only → document the full sequence
- `memory-bank/systemPatterns.md`: "Later steps consume the printed path" → the entrypoint now runs those steps

### Cross-Module Dependencies

- `start-the-roast` → `get-meta-ad`: execution handoff; `ads.json` + media in the workdir
- `start-the-roast` → `walk-the-funnel`: execution handoff after `funnel.json`; `steps.json` under `<workdir>/walk/`
- `start-the-roast` → hop map → analysis files: one file per hop plus creative and LP mock
- `start-the-roast` → `write-the-roast`: execution handoff after analysis files exist
- Walker process does not load marketing skills. Analysis reads artifacts only.

### Boundary Changes

- `/start-the-roast` public contract: deliverable becomes workdir **and** report path, not workdir alone
- `funnel.json` schema unchanged
- No CLI, capture, or score code changes

## Open Questions

- [x] How should the orchestrator hand off the walk, per-hop marketing skills, and the report? → Resolved: one-shot `/walk-the-funnel`, local hop → skill map, `/write-the-roast` (see `memory-bank/active/creative/creative-orchestrator-handoffs.md`)

## Test Plan (TDD)

### Behaviors to Verify

- Missing funnel URL or ads deeplink → stop; no workdir; no fetch; no walk; no report
- Valid inputs → workdir created; `get-meta-ad` invoked; `funnel.json` written
- After `funnel.json` → `walk-the-funnel` invoked with `--out <workdir>` and `--run-id walk`
- After `steps.json` → one analysis file per hop plus `analysis/creative.md` and LP-mock outputs
- After analysis → `write-the-roast` invoked; report file exists in the workdir
- Walk CLI failure → stop; no invented hops; no report from imagined pages
- Empty `ads` → walk still runs; creative / message-match findings record the miss; no invented ad
- Agent following the skill does not call `npm run score` and does not drive the browser itself

### Test Infrastructure

- Framework: `node:test` via `npm test` (capture helpers only)
- Test location: `src/capture/*.test.ts`
- Conventions: none for skills
- New test files: none — operator forbade unit tests; this task is prose and policy

### Integration Tests

- None. Acceptance is skill review against the sequence and the hop map.

## Implementation Plan

1. [x] Add the hop → skill map
    - Files: `skills/start-the-roast/references/hop-skills.md`
    - Tests first: N/A for prose & policy artifacts
    - Changes: table of artifact → skill → invert mode → output path; cite-only rule; "if Corey's skill is not on disk, follow this map — do not skip the hop"
    - Creative ref: `memory-bank/active/creative/creative-orchestrator-handoffs.md`
2. [x] Add `/write-the-roast`
    - Files: `skills/write-the-roast/SKILL.md`
    - Tests first: N/A for prose & policy artifacts
    - Changes: read workdir artifacts; write a PRD report card (ad cluster, journey cluster, four buckets, roast on the gaps, LP mock); print the report path; do not browse or recapture
3. [x] Extend `/start-the-roast` past intake
    - Files: `skills/start-the-roast/SKILL.md`
    - Tests first: N/A for prose & policy artifacts
    - Changes: rewrite frontmatter (this skill now runs the later steps); keep steps 1–5; add numbered steps for creative invert, walk handoff, per-hop analysis, LP mock, `write-the-roast`, print workdir + report path; delete "do not start any later pipeline step"; include the sequence flowchart; walk handoff passes `funnel.url` with `--out <workdir> --run-id walk`; read `<workdir>/walk/steps.json` from disk (do not rely on chat paste from `/walk-the-funnel`)
4. [x] Point docs at the new contract
    - Files: `README.md`, `memory-bank/systemPatterns.md`
    - Tests first: N/A for prose & policy artifacts
    - Changes: README "Start a roast" lists the four-stage sequence; systemPatterns entrypoint paragraph says the roast skill runs walk + analysis + report and names `skills/write-the-roast` as the report entrypoint
5. [x] Add report layout reference *(preflight advisory)*
    - Files: `skills/write-the-roast/references/report-layout.md`
    - Tests first: N/A for prose & policy artifacts
    - Changes: cite PRD write-up sections (ad cluster, journey cluster, four buckets, roast voice, LP mock); list required on-disk inputs and expected output filename under the workdir

## Technology Validation

No new technology - validation not required

## Challenges & Mitigations

- Live walk fails: print the CLI error and stop; do not invent hops or a report
- Corey's skills are not in the repo: `hop-skills.md` is the rubric; do not require a GitHub fetch
- Old frontmatter still forbids later steps: step 3 rewrites it and removes the stop line
- Agent pastes the report in chat: `write-the-roast` deliverable is the file path
- Agent calls `npm run score`: both new skills forbid it
- Capture writes `outDir/runId`: pass `--out <workdir> --run-id walk` so hops land at `<workdir>/walk/`

## Pre-Mortem

- The skill still reads as intake-only because a leftover "do not start later steps" survived: already covered by Challenge (frontmatter rewrite) — step 3 deletes that line in the title block and the last step
- The agent drives Playwright itself so it can "analyze at each click": the plan states walk is CLI-only and analysis starts only after `steps.json` exists
- Scope creeps into rewriting `src/score`: non-goal; no capture/score code in the file list

## Status

- [x] Component analysis complete
- [x] Open questions resolved
- [x] Test planning complete (TDD)
- [x] Implementation plan complete
- [x] Technology validation complete
- [x] Pre-Mortem complete
- [x] Preflight
- [x] Build
- [x] QA

## QA Results (2026-08-15)

**Verdict:** PASS

### Findings

- **Completeness:** All five implementation-plan items landed (`hop-skills.md`, `write-the-roast`, extended `start-the-roast` steps 6–11, README + `systemPatterns`, `report-layout.md`). Full sequence matches the creative flowchart (creative invert → walk → per-hop analysis → LP mock → report).
- **Pattern alignment:** Walker/judge split preserved. Sibling execution handoffs to `get-meta-ad`, `walk-the-funnel`, and `write-the-roast`. No `npm run score`. Product skills stay under `skills/`. Disk paths and hard stops match the plan.
- **Integrity:** Consistent deliverable contract — workdir + `report.html`. Walk lands at `<workdir>/walk/` via `--out` / `--run-id walk`. Hop names align with `walk-the-funnel/references/steps-json.md`.
- **Regression:** Intake steps 1–5 unchanged. No capture/score code touched. Leftover intake-only frontmatter removed.
- **Preflight advisory:** `report-layout.md` added; `write-the-roast` cites PRD layout instead of improvising structure.
- **Documentation (advisory):** Test-plan bullets in this file still say walk immediately after `funnel.json`; the mermaid, creative doc, and implementation correctly place creative invert before the walk. Update bullets when archiving — does not block acceptance.
- **Documentation (advisory):** README four-stage summary rolls walk + per-hop analysis into one line; accurate at operator altitude. Creative invert before walk is implicit, not spelled out.

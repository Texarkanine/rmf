# Task: abort-on-failed-walk

* Task ID: abort-on-failed-walk
* Complexity: Level 2
* Type: simple enhancement

A recorded hop that is not the intended page is a walk failure. The roast agent may recover or bail. It must not judge the wrong page. Aborting and telling the operator is a valid end state.

## Test Plan (TDD)

### Behaviors to Verify

These are agent-facing contracts, not executable product behavior. Do not add change-detector tests that assert on skill wording.

- CLI exit 0 is not enough: after capture, the agent inspects hop screenshots → a hop that is not the intended page fails the walk
- Failed walk: agent may retry or otherwise recover without typing PII or paying → or it stops and tells the operator analysis cannot be completed
- `start-the-roast` after a failed walk → no hop analysis files for the failed hop, no `report.html` from that walk
- Hop map: do not write a CRO roast of a challenge / interstitial / blank as if it were the store
- Handling is not a vendor list: Cloudflare is an example, not the definition

### Test Infrastructure

- Framework: Node `node:test` via `tsx` (`npm test`)
- Test location: `src/**/*.test.ts`
- Conventions: colocated `*.test.ts` next to the module
- New test files: none — prose and policy only (`always-tdd` carve-out)

## Implementation Plan

1. [x] Gate `walk-the-funnel` after the CLI returns
   - Files: `skills/walk-the-funnel/SKILL.md`
   - Tests first: N/A for prose & policy artifacts
   - Changes:
     - Insert a numbered **Step 4 — Inspect hops** between current Step 3 (Capture) and current Step 4 (Print). Renumber Print to Step 5.
     - After a 0-exit, read each hop screenshot at the path in `steps.json` (relative to the run dir). A hop that is not the intended page (bot wall, challenge, interstitial, blank chrome, leftover previous page) is a walk failure even when the process exited 0 and `steps.json` exists.
     - Inspect screenshots only. Do not open `bundle.json`. `visibleCopy` is stripped from `steps.json` on purpose (`src/capture/steps.test.ts`); do not add a bundle exception to the existing “Do not open `bundle.json`” rule.
     - The agent may retry the capture CLI or stop. Do not take over the Playwright session. Do not type PII or pay. Do not invent hops. Do not name a vendor-specific solver.
     - If inspect fails and retry did not produce the intended pages: print that the walk failed and **stop**. Do not print `steps.json` as the successful deliverable. Update the opening line so chat output on failure is the failure, not the hop list.
     - Keep the existing CLI-failure stop in Step 3.

2. [x] Gate `start-the-roast` before hop analysis
   - Files: `skills/start-the-roast/SKILL.md`
   - Tests first: N/A for prose & policy artifacts
   - Changes:
     - After reading `walk/steps.json`, inspect hop screenshots (same failure definition as walk Step 4) **before** Step 8.
     - **Edit the competing line.** Replace “When `steps.json` is on disk, continue to Step 8.” `steps.json` on disk is necessary, not sufficient. Continue to Step 8 only when every hop is the intended page.
     - If any hop is not the intended page: print the error, **stop**, do not write hop analysis, do not write a report. Recover-or-bail is the agent's call (retry the walk, wait, or stop). Telling the operator that analysis cannot be completed is an acceptable end state. Recovery must not type PII or pay. Do not invent hops.
     - Keep the existing CLI-failure and missing-`steps.json` stops.

3. [x] Stop hop-skills from roasting a failed page
   - Files: `skills/start-the-roast/references/hop-skills.md`
   - Tests first: N/A for prose & policy artifacts
   - Changes:
     - Keep “If `skills/<name>/SKILL.md` is not on disk, follow this map anyway. Do not skip the hop.” That line means a missing skill file is not a skip.
     - Add: if the hop artifact is not the intended page, do not write that hop's analysis and do not invent a score. Point back to the roast/walk stop. A failed capture is a stop, not a skip-with-a-score.

4. [x] Tell the operator in the README
   - Files: `README.md`
   - Tests first: N/A for prose & policy artifacts
   - Changes: One sentence on `/start-the-roast` / `/walk-the-funnel`: a hop that is not the real page fails the walk; the roast stops rather than scoring it.

## Technology Validation

No new technology - validation not required

## Dependencies

- Existing walk artifacts (`steps.json` hop list and screenshot paths)
- Existing start-the-roast stop rules (CLI fail, missing `steps.json`)

## Challenges & Mitigations

- Agent still judges a bot wall because the CLI exited 0: put the inspect-and-stop gate in both `walk-the-funnel` and `start-the-roast`, not only one
- Skill text accidentally specifies Cloudflare steps: define failure as “not the intended page”; Cloudflare is the motivating example only
- `hop-skills.md` currently says not to skip hops: keep that for a missing skill file; add that a failed capture is a stop, not a skip-with-a-score
- Temptation to add walker string-matching: out of scope; operator left handling to the agent

## Pre-Mortem

- Next roast still analyzes a verify screen because only README changed: already covered — hard stop in `start-the-roast` before Step 8
- We over-build a challenge detector in `funnel.ts` and fight the operator constraint: do not touch walker code in this task
- “Do not skip the hop” is read as a license to grade the wall: already covered by Step 3 — keep the missing-skill-file meaning, add the failed-page stop

## Preflight

- Result: `PASS WITH ADVISORY`
- TDD: prose and policy only; no change-detector tests scheduled
- Plan amendments applied: numbered inspect step in `walk-the-funnel`; `steps.json` on disk is not sufficient to enter roast Step 8; inspect screenshots only (do not open `bundle.json`); keep hop-skills “do not skip” for missing skill files
- Advisory (not applied): `write-the-roast` can still assemble `report.html` if invoked alone on a failed walk. The brief gates the report on `start-the-roast`. A third refuse-to-write sentence in `skills/write-the-roast/SKILL.md` is optional.

## Status

- [x] Initialization complete
- [x] Test planning complete (TDD)
- [x] Implementation plan complete
- [x] Technology validation complete
- [x] Pre-Mortem complete
- [x] Preflight
- [x] Build
- [x] QA

## QA

- Result: `PASS`
- Reviewed against the amended Level 2 plan and project brief acceptance criteria
- Findings:
  - **Advisory (non-blocking):** `write-the-roast` still has no failed-walk gate if invoked standalone. Preflight flagged this; the brief gates the report on `start-the-roast`. Out of plan scope.
  - **Advisory (non-blocking):** The README failure sentence lives under “Walk a funnel” only; “Start a roast” does not repeat it. One sentence was the plan; the walk section covers both skills.
  - **Advisory (non-blocking):** The hop failure definition is repeated in three skill files. Intentional self-containment for standalone skill invocation; not DRY debt.
- No blocking issues. Build changes not required.

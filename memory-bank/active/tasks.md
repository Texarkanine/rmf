# Task: abort-on-failed-walk

* Task ID: abort-on-failed-walk
* Complexity: Level 2
* Type: simple enhancement

A recorded hop that is not the intended page is a walk failure. The roast agent may recover or bail. It must not judge the wrong page. Aborting and telling the operator is a valid end state.

## Test Plan (TDD)

### Behaviors to Verify

These are agent-facing contracts, not executable product behavior. Do not add change-detector tests that assert on skill wording.

- CLI exit 0 is not enough: after capture, the agent inspects hop screenshots and visible copy → a hop that is not the intended page fails the walk
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

1. Gate `walk-the-funnel` after the CLI returns
   - Files: `skills/walk-the-funnel/SKILL.md`
   - Tests first: N/A for prose & policy artifacts
   - Changes: After Step 3, inspect each hop's screenshot (and visible copy if already on disk from the CLI). A hop that is not the intended page (bot wall, challenge, interstitial, blank chrome, leftover previous page) is a walk failure even when the process exited 0 and `steps.json` exists. The agent may recover without driving payment or typing PII. If it cannot, print that the walk failed and **stop**. Do not invent hops. Do not name a vendor-specific solver.

2. Gate `start-the-roast` before hop analysis
   - Files: `skills/start-the-roast/SKILL.md`
   - Tests first: N/A for prose & policy artifacts
   - Changes: After reading `walk/steps.json`, inspect hop artifacts before Step 8. If any hop is not the intended page, treat the walk as failed: print the error, **stop**, do not write hop analysis, do not write a report. Recover-or-bail is the agent's call. Telling the operator that analysis cannot be completed is an acceptable end state and better than judging the wrong page. Keep the existing CLI-failure and missing-`steps.json` stops.

3. Stop hop-skills from roasting a failed page
   - Files: `skills/start-the-roast/references/hop-skills.md`
   - Tests first: N/A for prose & policy artifacts
   - Changes: Replace “Do not skip the hop” as a license to grade whatever landed. If the artifact is not the intended page, do not write that hop's analysis. Point back to the roast/walk stop. Do not invent a score for a challenge screen.

4. Tell the operator in the README
   - Files: `README.md`
   - Tests first: N/A for prose & policy artifacts
   - Changes: One sentence on `/start-the-roast` / `/walk-the-funnel`: a hop that is not the real page fails the walk; the roast stops rather than scoring it.

## Technology Validation

No new technology - validation not required

## Dependencies

- Existing walk artifacts (`steps.json`, screenshots, optional `bundle.json` visible copy)
- Existing start-the-roast stop rules (CLI fail, missing `steps.json`)

## Challenges & Mitigations

- Agent still judges a bot wall because the CLI exited 0: put the inspect-and-stop gate in both `walk-the-funnel` and `start-the-roast`, not only one
- Skill text accidentally specifies Cloudflare steps: define failure as “not the intended page”; Cloudflare is the motivating example only
- `hop-skills.md` currently says not to skip hops: rewrite that so a failed capture is a stop, not a skip-with-a-score
- Temptation to add walker string-matching: out of scope; operator left handling to the agent

## Pre-Mortem

- Next roast still analyzes a verify screen because only README changed: already covered — hard stop in `start-the-roast` before Step 8
- We over-build a challenge detector in `funnel.ts` and fight the operator constraint: do not touch walker code in this task
- “Do not skip the hop” survives and agents keep writing `analysis/cart.md` for the wall: already covered by Step 3

## Status

- [x] Initialization complete
- [x] Test planning complete (TDD)
- [x] Implementation plan complete
- [x] Technology validation complete
- [x] Pre-Mortem complete
- [ ] Preflight
- [ ] Build
- [ ] QA

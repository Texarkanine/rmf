# Progress

Teach the walk and roast skills that a hop which is not the real page is a walk failure. The agent may recover or bail. Do not judge an incorrect walk.

**Complexity:** Level 2

## 2026-08-15 - COMPLEXITY-ANALYSIS - COMPLETE

* Work completed
    - Classified abort-on-failed-walk as Level 2
    - Wrote project brief from the approved intent plus the operator's handling constraint
* Decisions made
    - Level 2: skill-level failure awareness across the roast pipeline, not a new challenge-solving subsystem
    - Operator constraint: do not over-specify handling; abort-and-tell is a valid end state
* Insights
    - Today's walker already fails on missing cart URL or checkout-still-landing; it does not fail when `/cart` is a bot wall
    - `start-the-roast` already stops on CLI failure or missing `steps.json`; it does not inspect whether a recorded hop is the real page

## 2026-08-15 - PLAN - COMPLETE

* Work completed
    - Wrote the Level 2 plan: inspect-and-stop in `walk-the-funnel` and `start-the-roast`, rewrite hop-skills so a failed page is not graded, one README sentence
* Decisions made
    - No `src/capture` changes this task — handling stays with the agent
    - No new tests — prose and policy only
* Insights
    - `hop-skills.md` “Do not skip the hop” is the line that licensed roasting the Cloudflare cart

## 2026-08-15 - PREFLIGHT - COMPLETE (PASS WITH ADVISORY)

* Work completed
    - Validated the Level 2 plan against `walk-the-funnel`, `start-the-roast`, `hop-skills.md`, `write-the-roast`, `steps.json` shape, and walker fail conditions
    - Amended the plan: numbered inspect step; `steps.json` on disk is not enough to enter roast Step 8; inspect screenshots only; keep hop-skills “do not skip” for missing skill files
    - Wrote `memory-bank/active/.preflight-status` as `PASS WITH ADVISORY`
* Decisions made
    - TDD carve-out holds: skill and README wording only; no change-detector tests
    - Do not open `bundle.json` for the inspect — `visibleCopy` is not in `steps.json`
    - Recovery after CLI exit is retry-or-stop, not taking over Playwright
* Insights
    - `start-the-roast` line “When `steps.json` is on disk, continue to Step 8” would beat a buried inspect paragraph unless that line is edited
    - `write-the-roast` is an un-gated standalone report entry; left as advisory, not a third required file

## 2026-08-15 - BUILD - COMPLETE

* Work completed
    - Inserted walk inspect Step 4; roast inspect before Step 8; hop-skills stop on a failed page; README sentence
    - Full suite: 16 passing
* Decisions made
    - No deviations from the amended plan
    - Did not add a `write-the-roast` refuse gate (preflight advisory, not applied)
* Insights
    - The competing roast line was the one that sent Heart & Soil into cart analysis after a 0-exit walk

## 2026-08-15 - QA - COMPLETE (PASS)

* Work completed
    - Semantic review of walk-the-funnel Step 4 inspect, start-the-roast pre-Step 8 inspect, hop-skills failed-page stop, and README sentence against the amended plan and acceptance criteria
    - Wrote `memory-bank/active/.qa-validation-status` as `PASS`
* Decisions made
    - `write-the-roast` standalone gap remains advisory only — not a blocking FAIL
    - Repeated failure definitions across skill files are acceptable for self-contained skills
* Insights
    - Dual gates (walk inspect + roast inspect) match the pre-mortem: a README-only change would not have stopped Heart & Soil

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

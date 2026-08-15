---
task_id: abort-on-failed-walk
complexity_level: 2
date: 2026-08-15
status: completed
---

# TASK ARCHIVE: abort-on-failed-walk

## SUMMARY

A hop that is not the intended page is now a walk failure. The Heart & Soil cart hop was a Cloudflare “Verifying…” screen at a `/cart` URL; the walker exited 0 and the roast judged the wall. Walk and roast skills now inspect hop screenshots, then recover or bail. Aborting and telling the operator is a valid end state.

## REQUIREMENTS

From the project brief:

- A hop that is not the intended page is a walk failure.
- The agent decides how to handle it. Do not prescribe a Cloudflare solver.
- Bailing out and telling the operator that analysis cannot be completed is better than judging the wrong page.
- Do not write hop analysis or `report.html` against a failed hop.
- Walker-does-not-judge and stop-before-PII still hold.

## IMPLEMENTATION

Level 2. Skill and README only. No `src/capture` changes.

- [`skills/walk-the-funnel/SKILL.md`](../../../skills/walk-the-funnel/SKILL.md) — Step 4 inspects hop screenshots after a 0-exit CLI. Print is Step 5 and only when inspect passed. Failure output is the failure, not the hop list.
- [`skills/start-the-roast/SKILL.md`](../../../skills/start-the-roast/SKILL.md) — replaced “When `steps.json` is on disk, continue to Step 8.” Inspect screenshots before analysis. Stop before hop files and the report.
- [`skills/start-the-roast/references/hop-skills.md`](../../../skills/start-the-roast/references/hop-skills.md) — keep “do not skip” for a missing skill file. A failed capture is a stop, not a skip-with-a-score.
- [`README.md`](../../../README.md) — one sentence: not-the-page fails the walk; the roast stops.
- [`memory-bank/systemPatterns.md`](../../systemPatterns.md) — standing contract: a hop that is not the page is a walk failure.

## TESTING

No new automated tests — TDD carve-out for prose and policy.

- `npm test`: 16 passing.
- Preflight: `PASS WITH ADVISORY`. Amended the plan (numbered inspect step; `steps.json` on disk is not enough; inspect screenshots only; keep hop-skills “do not skip” for missing skill files). Advisory left unapplied: `write-the-roast` invoked alone can still assemble a report.
- QA (Composer 2.5 Fast): `PASS`. Same advisory plus README placement and repeated failure wording.

## LESSONS LEARNED

- URL classification (`/cart`) is not page identity. The Heart & Soil hop was a cart URL and a Cloudflare screenshot.
- A later “continue when file exists” line will beat an inspect paragraph unless you edit that line.
- Dual gates (walk inspect + roast inspect) matter. A README-only change would not have stopped the bad roast.

## PROCESS IMPROVEMENTS

- Preflight’s catch of the competing roast line was the useful review. Keep “edit the line that continues” as a plan check when adding a gate.

## TECHNICAL IMPROVEMENTS

If this had been a founding assumption, `steps.json` would carry an integrity flag and the roast would refuse a failed hop in one place. What shipped — agent inspect of screenshots, recover or bail — matches the operator constraint: do not over-specify handling.

## NEXT STEPS

Optional: a refuse-to-write sentence in `skills/write-the-roast/SKILL.md` if that skill is invoked alone on a failed walk. Not required for this task.

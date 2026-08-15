---
task_id: start-the-roast
complexity_level: 3
date: 2026-08-15
status: completed
---

# TASK ARCHIVE: start-the-roast

## SUMMARY

Added the roast entrypoint skill at `skills/start-the-roast`. An operator hands in a funnel URL and a Meta ads deeplink; the skill writes a slobac-style timestamped folder under `.rmf/` containing `funnel.json` (and retrieved ad media when it lands) and prints that directory path. Prose only: no unit tests, no retrieval library.

## REQUIREMENTS

From the project brief:

- Add the entrypoint skill at `skills/start-the-roast`.
- Collect a funnel URL and a deeplink to a set of Meta ads.
- Save a spec of the ads to a timestamped dotfolder, following Texarkanine/slobac run layout (per-run folder under a local dot-directory, ISO-8601 seconds timestamp).
- Finish by printing the on-disk directory later steps consume.
- That directory contains `funnel.json` with the funnel URL and ad info, plus links to ad media paths on disk when media was retrievable.
- Work on a branch off `main`. Do not build the rest of the roast pipeline.
- Operator constraint (2026-08-15): prose only — no unit tests, no retrieval library.

Acceptance criteria: the skill exists; a successful run creates the timestamped folder and prints its path; `funnel.json` has the URL and ad info; media paths appear only when files exist.

## IMPLEMENTATION

Level 3 plan, no creative phase. Open questions resolved in plan:

- Prose only, no unit tests (operator).
- Run parent is `.rmf/<UTC ISO-8601 seconds>/` (product name, slobac layout). `--workdir` overrides. Writable-dir precondition. Media under `media/`.
- Agent fetches the deeplink with ordinary tools. No Marketing API, no scraper package. Best-effort media.

Five build steps, all landed:

1. `.gitignore` — ignore `.rmf/` (kept main's existing ignore list on rebase).
2. `skills/start-the-roast/references/funnel-json.md` — required keys `funnel.url`, `source.ads_deeplink`, `ads[]`; media `path` omitted unless the file exists.
3. `skills/start-the-roast/SKILL.md` — six-step workflow: collect inputs, establish workdir, read schema, fetch ads, write `funnel.json`, print the path.
4. `README.md` — short "Start a roast" section (rebased onto main's capture/score README).
5. `memory-bank/productContext.md` — surgical update for the entrypoint use case.

Also: `AGENTS.md` / `CLAUDE.md` bootstrap, `memory-bank/systemPatterns.md` records that product skills live under `skills/` and runs land under `.rmf/`.

Branch was rebased onto `origin/main` before archive so this work sits on the live funnel-capture / visual-explainer tree.

## TESTING

No automated tests — operator forbade a suite for this task. TDD carve-out for prose and policy artifacts.

- Preflight: `PASS WITH ADVISORY`. Advisory (not applied): screenshot the deeplink into `media/` when a creative download fails, if the agent has browser tools. `/niko-build` did not request it.
- Build: five planned files written; no linter or package to run for the skill itself.
- QA: `PASS`. No blocking findings. Schema stays in the reference file; the skill stays a six-step workflow.

## LESSONS LEARNED

- Product skills live under `skills/`, not `.cursor/skills/`. The on-disk contract is `.rmf/<timestamp>/funnel.json`; media `path` exists only when the file does.
- A schema reference plus a required read-before-write locks an agent-written handoff without a validator.
- "Prose only, no unit tests" collapsed the executable-vs-skill question immediately. For a two-file skill, L3 still paid for the schema lock and the preflight stale-doc catch; it did not need a creative loop.

## PROCESS IMPROVEMENTS

- Preflight's only fix was a stale `productContext.md` bullet the README step would invalidate. That is the cheap catch preflight is for; keep it.
- Skipping creative did not produce a QA miss when the operator and a cited run pattern already answered the design questions.

## TECHNICAL IMPROVEMENTS

None beyond the standing patterns already written into `memory-bank/systemPatterns.md` (`skills/` vs `.cursor/skills/`, `.rmf/` run folders).

## NEXT STEPS

None for this task. Later roast steps consume the printed run directory; they were out of scope here.

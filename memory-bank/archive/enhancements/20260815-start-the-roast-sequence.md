---
task_id: start-the-roast-sequence
complexity_level: 3
date: 2026-08-15
status: completed
---

# TASK ARCHIVE: start-the-roast-sequence

## SUMMARY

Extended `/start-the-roast` from intake-only (stop after `funnel.json`) into the roast orchestrator. One invocation now gathers inputs, invokes `/get-meta-ad`, inverts `ad-creative`, walks the live funnel with `/walk-the-funnel`, applies `cro` at each hop, drafts the LP mock, and writes `report.html` via `/write-the-roast`. Skill and prose only.

## REQUIREMENTS

From the project brief:

- Work on a branch off `main`.
- Sequence: gather info → `/get-meta-ad` → Playwright walk with the matching marketing skill at each hop → final report.
- Keep intake: funnel URL + ads deeplink, writable `.rmf/<timestamp>/` or `--workdir`, `funnel.json` schema.
- Do not inline Ad Library fetch.
- Walk with the existing CLI walker, not an agent clicker.
- PRD rubric map: invert `ad-creative` for the ad; `cro` for destination / on-site / checkout; `copywriting` + `image` for the v1 LP mock.
- Produce the final report from on-disk evidence.

Constraints: no unit tests; preflight and QA on Composer 2.5 Fast; walker does not judge; stop before PII or payment; product skills under `skills/`; do not call `npm run score`; do not vendor Corey's full skill tree.

Acceptance: later pipeline steps are required; Meta fetch is a handoff; walk hops come from `steps.json` on disk; each hop has an analysis file; `report.html` lands in the workdir; no new tests.

## IMPLEMENTATION

Level 3. One architecture creative. Preflight PASS WITH ADVISORY added `report-layout.md`.

Key files:

- `skills/start-the-roast/references/hop-skills.md` — hop → skill → invert mode → `analysis/` path
- `skills/write-the-roast/SKILL.md` — assemble `report.html` from disk
- `skills/write-the-roast/references/report-layout.md` — PRD canvas (ad cluster, journey cluster, four buckets, LP mock)
- `skills/start-the-roast/SKILL.md` — steps 1–5 unchanged; steps 6–11 run creative invert, walk (`--out <workdir> --run-id walk`), per-hop analysis, LP mock, report; frontmatter re-derived
- `README.md` and `memory-bank/systemPatterns.md` — entrypoint now sequences the full run

No capture or score code. `funnel.json` schema unchanged. Walk artifacts land at `<workdir>/walk/`.

### Creative decision (inlined)

Open question: how the orchestrator hands off walk, per-hop marketing skills, and the report.

Options:

- Interleaved hop agent — drive the browser one hop at a time and analyze after each click. Rejected: live grading agent; breaks walker-does-not-judge.
- Vendor and score — vendor Corey's skills and call `npm run score`. Rejected: old eight-dimension rubric; heavy vendor of generate-ads workflows.
- One-shot walk, local hop map, report skill — selected.

Rationale: the CLI walks; marketing skills run as rubric against artifacts; the report is a first-class handoff. Tradeoff: analysis is not live during clicks; Corey's full skill text is not vendored.

Hop map:

| Artifact | Skill | Rubric mode | Output |
| --- | --- | --- | --- |
| Retrieved ad | `ad-creative` | Invert: hook, offer, visual, CTA | `analysis/creative.md` |
| `landing` | `cro` | Message match vs the ad | `analysis/landing.md` |
| `add_to_cart` | `cro` | On-site | `analysis/add_to_cart.md` |
| `cart` | `cro` | On-site (not its own bucket) | `analysis/cart.md` |
| `checkout` | `cro` | Friction, surprises, trust, field load | `analysis/checkout.md` |
| After landing | `copywriting` + `image` | Single-purpose LP still | `analysis/lp-mock.md` and `media/lp-mock.png` when generated |

## TESTING

No new automated tests — operator forbade a suite for this task. TDD carve-out for prose and policy.

- Preflight: `PASS WITH ADVISORY`. Applied: `report-layout.md`; read `<workdir>/walk/steps.json` from disk; name `write-the-roast` in systemPatterns.
- Build: five planned files written. Existing `npm test`: 16 passing (`classifyPage`, cart helpers, payment-stop, `toSteps`).
- QA (Composer 2.5 Fast): `PASS`. Advisories: stale test-plan bullet said walk starts right after `funnel.json` (implementation correctly inverts creative first); README folds walk + per-hop analysis into one operator-altitude line.
- Persistent reconcile: productContext and techContext unchanged. systemPatterns already carried the new entrypoint contract from build.

## LESSONS LEARNED

- An orchestrator frontmatter that says "do not run later pipeline steps" will keep winning after you add those steps to the body. Re-derive the description when the skill changes shape.
- A sibling skill that prints JSON to chat is not a disk handoff. Name the file path at the invoke step.
- Fast-forward `main` before classify. `#9` and `#10` already shipped `get-meta-ad` and `walk-the-funnel`; without that fetch the plan would have reinvented them.

## PROCESS IMPROVEMENTS

- Preflight advisories that add a reference file (layout, schema) are cheaper than QA finding an improvised report.
- When creative reorders a pipeline, update the test-plan behavior bullets in the same pass. Stale bullets become QA noise.

## TECHNICAL IMPROVEMENTS

None beyond the standing patterns already written into `memory-bank/systemPatterns.md` (roast entrypoint sequences walk + analysis + `write-the-roast`; walk under a roast lands at `<workdir>/walk/`).

## NEXT STEPS

None for this task. A fresh session runs `/start-the-roast` with a funnel URL and a Meta ads deeplink and should print the workdir and `report.html`.

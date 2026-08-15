# Current Task: Roast My Funnel launcher (PR #1)

**Complexity:** Level 1

## Scope reviewed

Changeset `6e7bf80...a04adec` on `cursor/roast-my-funnel-launcher-8256`:

- [x] `product-brief.md` — hackathon product record
- [x] `.cursor/skills/shared/github-open-a-pull-request-gh/` — vendored via ai-rizz
- [x] `ai-rizz.skbd` — records the new rule

No Niko plan, creative docs, or build checklist existed. Review baseline was the commit intent (record the product; add the PR skill) plus `product-brief.md` as the product north star.

## QA results

**Result:** PASS (advisories only)

- Completeness: launcher deliverables are present and finished. The `roast-my-funnel` skill described in the brief is future work, not this PR.
- Documentation (advisory): `README.md` is still `# rmf`.
- YAGNI (advisory): the GitHub PR skill is orthogonal to the product brief; acceptable as repo scaffolding.
- Integrity (advisory): imported skill uses unquoted `$TEMPFILE` and chained `echo` for the PR body.
- Process (advisory, not in the tree): PR #1 title is not a conventional commit; the PR body is an unfilled template.

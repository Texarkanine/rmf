---
name: start-the-funnel
description: >
  Resolve a funnel URL and a run directory, then hand off to the funnel-walk
  orchestrator so Grok can walk the live site to checkout and write walk.jsonl.
  Use when starting a funnel walk, walking a site to checkout, or continuing a
  roast after start-the-roast printed a workdir. Do not use to collect ads,
  write roast copy, score a Playwright bundle, or run npm run capture.
---

# Start the Funnel

Single-agent setup. Disk is the handoff. This skill does not walk and does not judge.

## Step 1 — Establish workdir

### Override

If the invocation includes `--workdir <path>`, use that path. Create it if it does not exist.

### Default

Otherwise create `.rmf/<timestamp>/` in the operator's current working directory. `<timestamp>` is UTC at seconds precision with colons replaced by hyphens so the name is one path segment (example: `2026-05-12T18-30-45`). Create `.rmf/` if it does not exist.

### Writable check

Create a small file in the workdir and delete it. If that write fails, **stop**. Name the path and the failure reason. Do not continue without a writable workdir.

## Step 2 — Resolve the funnel URL

Need one absolute HTTP(S) URL.

1. Use a funnel URL from the invocation when one was given.
2. Else, if `<workdir>/funnel.json` exists, use its `funnel.url`.
3. If still missing, ask for the URL and **stop**. Do not invoke the orchestrator.

## Step 3 — Invoke the orchestrator

Read and execute [`../funnel-walk-orchestrator/SKILL.md`](../funnel-walk-orchestrator/SKILL.md) with:

- the absolute workdir path from Step 1
- the funnel URL from Step 2

Do not walk the site in this skill. Do not write judgements. Do not launch Playwright. Do not run `npm run capture`.

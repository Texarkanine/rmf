---
name: walk-the-funnel
description: >
  Run the Playwright capture CLI against a live sales-funnel URL, write
  steps.json, and print that hop list. Use when walking a funnel, capturing
  checkout, or checking whether a store reaches payment fields. Do not use
  for scoring, roasting ads, writing report cards, or starting Niko.
---

# Walk the Funnel

Single-agent workflow. The CLI walks. Chat output is `steps.json`.

Do not invoke Niko. Do not score. Do not roast. Do not write HTML. Do not open `bundle.json`. Do not type email, address, or card data into the browser.

## Step 1 — Collect the URL

Resolve one value from the invocation: an absolute HTTP(S) funnel URL.

If it is missing or not an absolute HTTP(S) URL, ask for it and **stop**. Do not install anything. Do not launch Playwright.

Optional flags from the invocation, passed through to the CLI when present:

- `--out <dir>`
- `--run-id <id>`
- `--delay-ms <n>`

## Step 2 — Install only if missing

If `node_modules/` is missing, run `npm ci` and `npx playwright install chromium`.

If `node_modules/` exists, skip install.

## Step 3 — Capture

From the repo root, run exactly:

```bash
HEADLESS=1 npm run capture -- <url>
```

Append any optional flags from Step 1 after the URL.

The CLI walks landing → product → cart → checkout and stops before payment. Do not drive the browser yourself. Do not click Pay now.

If the command fails, print the error and **stop**. Do not invent hops. Do not start another workflow.

## Step 4 — Print steps.json

The CLI prints a run directory on the first stdout line (`runs/<id>`).

Read [`references/steps-json.md`](references/steps-json.md), then read `<runDir>/steps.json`.

Print:

1. The absolute path of the run directory.
2. The `steps.json` body.

That is the deliverable.

Do not paste `bundle.json`. Do not paste DOM HTML. Do not start `/score`, `/start-the-roast`, or `/niko`.

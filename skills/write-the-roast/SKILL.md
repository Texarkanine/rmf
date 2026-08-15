---
name: write-the-roast
description: >
  Assemble a funnel roast report card from an existing run directory
  (funnel.json, walk artifacts, and analysis files). Use when writing the
  roast report, report card, or Funnel Score HTML after a walk. Do not use
  for capturing a site, fetching ads, starting Niko, or running npm run score.
---

# Write the Roast

Single-agent workflow. Disk is the handoff. Chat output is the report path.

Do not browse. Do not recapture. Do not drive a browser. Do not call `npm run score`. Do not invent pages, ads, or findings.

```mermaid
flowchart LR
  workdir["Collect workdir"] --> layout["Read report-layout"]
  layout --> facts["Read on-disk facts"]
  facts --> html["Write report.html"]
  html --> print["Print report path"]
```

## Step 1 — Collect the workdir

Resolve one value: the roast run directory (the path `/start-the-roast` created, or `--workdir <path>`).

If it is missing or not a directory, ask for it and **stop**. Do not write HTML.

## Step 2 — Read the layout

Read [`references/report-layout.md`](references/report-layout.md). Do not write the report until this read is done.

## Step 3 — Read on-disk facts

Read only files that exist under the workdir:

- `funnel.json`
- `ads.json`
- `walk/steps.json`
- every file in `analysis/`
- artifact paths those files cite (`walk/artifacts/…`, `media/…`)

A missing file is a gap. Record it. Do not invent its contents.

## Step 4 — Write report.html

Write `<workdir>/report.html` to the layout from Step 2.

Every roast line and every grade cites an artifact path that exists. Shared destination URLs get one journey tile. Do not include an Ad Library chrome screenshot.

If `analysis/lp-mock.md` names `media/lp-mock.png` and that file exists, put the image next to the primary ad / destination gap. Omit the image when the file is missing.

## Step 5 — Print the report path

Print the absolute path of `<workdir>/report.html`. That path is the deliverable.

Do not paste `report.html` into chat. Do not paste `funnel.json` or `steps.json`.

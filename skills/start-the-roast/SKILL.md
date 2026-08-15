---
name: start-the-roast
description: >
  Collect a sales-funnel URL and a Meta or Facebook ads deeplink (a single-ad
  library link with id=, or a library search or page), write a timestamped
  run folder with funnel.json and any retrieved ad media, and print that
  folder path. Use when starting a roast, beginning a roast run, or gathering
  ads plus a landing page into on-disk inputs. Do not use for writing roast
  copy, critiquing ads, auditing tests, or running later roast pipeline steps.
---

# Start the Roast

Single-agent workflow. Disk is the handoff. Chat output is the run directory path.

## Step 1 — Collect inputs

Resolve two values from the invocation:

1. **Funnel** — an absolute HTTP(S) URL for the landing page or offer.
2. **Ads deeplink** — an absolute HTTP(S) URL to Meta or Facebook ads. A library URL with a non-empty `id` query parameter is one ad. A URL without `id` is a set.

If either value is missing or is not an absolute HTTP(S) URL, ask for the missing piece and **stop**. Do not create a run directory. Do not fetch ads.

## Step 2 — Establish workdir

Create the run directory. It persists if later steps only retrieve part of the ads.

### Default path

`.rmf/<timestamp>/` in the operator's current working directory. `<timestamp>` is UTC at seconds precision with colons replaced by hyphens so the name is one path segment (example: `2026-05-12T18-30-45`). Create `.rmf/` if it does not exist.

### Override

If the invocation includes `--workdir <path>`, use that path instead of the default. Create it if it does not exist.

### Writable check

Create a small file in the workdir and delete it. If that write fails, **stop**. Name the path and the failure reason. Do not continue without a writable workdir.

## Step 3 — Read the schema

Read [`references/funnel-json.md`](references/funnel-json.md). That file is the shape of `funnel.json`. Do not write `funnel.json` until this read is done.

## Step 4 — Fetch ads

Invoke [`../get-meta-ad/SKILL.md`](../get-meta-ad/SKILL.md) with:

1. The ads deeplink from Step 1
2. The workdir from Step 2

Do not open, fetch, or parse the Ad Library yourself. That skill writes `<workdir>/ads.json` and any media files.

When it finishes, continue to Step 5. A missing `ads.json` or an empty `ads` array is not a failure.

## Step 5 — Write funnel.json

Write `<workdir>/funnel.json` to the schema from Step 3.

- `funnel.url` is the funnel from Step 1.
- `source.ads_deeplink` is the deeplink from Step 1, stored as given.
- `ads` is the `ads` array from `<workdir>/ads.json`. Use `[]` when that file is missing or `ads` is empty.
- For each media object, include `path` only after confirming that file exists under the workdir. Omit `path` when the file is missing.

Do not invent ads, copy, or media paths.

## Step 6 — Print the run directory

Print the absolute path of the workdir. That path is the deliverable.

Do not paste `funnel.json` into chat. Do not roast, rewrite, or critique the ads. Do not start any later pipeline step.

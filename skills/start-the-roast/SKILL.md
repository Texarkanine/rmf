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

Parse the ads deeplink first. If it has a non-empty `id` query parameter, the run is **pinned** to that id. Otherwise the run is a **set**.

Open or fetch the exact deeplink with ordinary agent tools (HTTP fetch or a browser). Do not call the Meta Marketing API or the Graph API. Do not add a scraper package or helper script.

### Pinned

Extract only the ad whose platform id equals the `id` query value: id, permalink, advertiser, body, headline, description, CTA, and creative URLs.

If the page lists other ads, ignore them. If the matching ad is not found, extract nothing (`ads` will be `[]`). Do not substitute a sibling, related, or advertiser-page ad.

If HTTP is blocked and a browser (or a browser subagent) is used: open that same URL only. Stay on it. Do not click other library cards, "See more ads", advertiser pages, or search results. Any helper you spawn must be told the target id and this stay-on-URL rule.

### Set

Extract every ad the page yields: id, permalink, advertiser, body, headline, description, CTA, and creative URLs.

### Media

For each creative URL on an extracted ad, try to download the file into `<workdir>/media/`. Name files `media/<ad-id>-<index>.<ext>` using the ad id when known, a zero-based index, and an extension from the URL or `Content-Type`. Create `media/` only when at least one file lands.

A failed page fetch or a failed download does not fail the run. Continue to Step 5 with whatever was retrieved.

Do not write a `path` for a file that is not on disk.

## Step 5 — Write funnel.json

Write `<workdir>/funnel.json` to the schema from Step 3.

- `funnel.url` is the funnel from Step 1.
- `source.ads_deeplink` is the deeplink from Step 1, stored as given.
- `ads` is the extracted list. Use `[]` when nothing was extracted. A pinned deeplink yields at most one ad.
- For each media object, include `path` only after confirming that file exists under the workdir. Omit `path` when the file is missing.

Do not invent ads, copy, or media paths.

## Step 6 — Print the run directory

Print the absolute path of the workdir. That path is the deliverable.

Do not paste `funnel.json` into chat. Do not roast, rewrite, or critique the ads. Do not start any later pipeline step.

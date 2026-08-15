# Project Brief

## User Story

As an operator, I want an entrypoint skill that collects a funnel and a Meta ads deeplink and writes a structured run folder so later roast steps have a single on-disk input directory.

## Use-Case(s)

### Start a roast from a funnel and ads

The operator invokes `skills/start-the-roast` with a funnel and a deeplink to a set of Meta ads. The skill writes a timestamped run folder and prints that folder's path.

### Media available

When ad media can be retrieved, the run folder stores the files and `funnel.json` points at those paths.

### Media not available

When ad media cannot be retrieved, the skill still writes `funnel.json` with the funnel URL and ad info, without pretending media is on disk.

## Requirements

1. Add the entrypoint skill at `skills/start-the-roast`.
2. Collect starting inputs: a funnel and a deeplink to a set of Meta ads.
3. Save a spec of the Meta ad(s) to a timestamped dotfolder, following how [Texarkanine/slobac](https://github.com/Texarkanine/slobac) stores runs (per-run folder under a local dot-directory, ISO-8601 seconds timestamp).
4. Finish by outputting the on-disk directory that later steps consume.
5. That directory contains `funnel.json` with the funnel URL and the ad info, plus links to ad media paths on disk when media was retrievable.

## Constraints

1. Work happens on a branch off `main`.
2. Follow slobac's run-directory pattern; do not invent a different persistence model.
3. Do not build the rest of the roast pipeline in this task.
4. Prose only: write the skill and its reference docs. No unit tests and no retrieval library in this task.

## Acceptance Criteria

1. `skills/start-the-roast` exists and can be invoked as the entrypoint.
2. A successful run creates a timestamped dotfolder and prints its path.
3. The folder contains `funnel.json` with the funnel URL and ad info.
4. When media was retrieved, `funnel.json` links to those on-disk paths.
5. When media was not retrieved, `funnel.json` still records the ads without fabricated media paths.

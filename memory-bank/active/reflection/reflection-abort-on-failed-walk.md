---
task_id: abort-on-failed-walk
date: 2026-08-15
complexity_level: 2
---

# Reflection: abort-on-failed-walk

## Summary

Skill gates now treat a hop that is not the intended page as a walk failure. The roast may recover or bail; it must not judge a bot wall. QA passed.

## Requirements vs Outcome

Delivered as asked. No walker detector, no Cloudflare recipe. Abort-and-tell is written as a valid end state. The preflight advisory (`write-the-roast` invoked alone) was left unapplied on purpose.

## Plan Accuracy

The plan’s file list and sequence were right. The real bug was one roast line: “When `steps.json` is on disk, continue to Step 8.” Preflight caught that before build.

## Build & QA Observations

Build was prose only. QA found no blocks. Three advisories: standalone report entry, README sentence under Walk not Start, repeated failure wording across skills.

## Insights

### Technical
- URL classification (`/cart`) is not page identity. The Heart & Soil hop was a cart URL and a Cloudflare screenshot.

### Process
- A later “continue when file exists” line will beat an inspect paragraph unless you edit that line.

### Million-Dollar Question

If this had been a founding assumption, `steps.json` would carry an integrity flag and the roast would refuse a failed hop in one place. What we shipped — agent inspect of screenshots, recover or bail — matches the operator constraint: do not over-specify handling.

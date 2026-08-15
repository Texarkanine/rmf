# Active Context

## Current Task: pin-ad-library-id
**Phase:** BUILD - COMPLETE

## What Was Done
- Pinned `/start-the-roast` collection when the ads deeplink has a non-empty `id` query parameter.
- Browser / subagent fallback may open that same URL only; it must not click sibling library cards.
- Schema note: a pinned deeplink yields at most one ad.
- Set URLs (no `id`) still extract every ad the page yields.

## Next Step
- `/niko-qa` with Grok.

# Current Task: pin-ad-library-id

**Complexity:** Level 1

## Build

- [x] Locate: Step 4 said "extract every ad the page yields." A direct `?id=` Ad Library URL still renders sibling ads, and a browser fallback clicks them.
- [x] Fix: Pin collection to the `id` query value. Browser helpers stay on that URL. Set URLs (no `id`) keep current behavior.
- [x] Files: `skills/start-the-roast/SKILL.md`, `skills/start-the-roast/references/funnel-json.md`

No automated tests — skill wording, not executable behavior.

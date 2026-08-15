# Current Task: pin-ad-library-id

**Complexity:** Level 1

## Build

- [x] Locate: Step 4 said "extract every ad the page yields." A direct `?id=` Ad Library URL still renders sibling ads, and a browser fallback clicks them.
- [x] Fix: Pin collection to the `id` query value. Browser helpers stay on that URL. Set URLs (no `id`) keep current behavior.
- [x] Files: `skills/start-the-roast/SKILL.md`, `skills/start-the-roast/references/funnel-json.md`

No automated tests — skill wording, not executable behavior.

## QA

- [x] Review `skills/start-the-roast/SKILL.md` and `references/funnel-json.md` against the project brief
- **Result:** PASS
- **Findings**
  - Completeness: pin-on-`id`, match-only extract, stay-on-URL for browser/subagent, `ads: []` on miss, and set-mode "every ad the page yields" are all present. Does not block.
  - KISS: Step 4 split into Pinned / Set / Media is the minimum structure. Does not block.
  - DRY (advisory): extract field list is repeated in Pinned and Set so each branch is self-contained. Does not block.
  - YAGNI: pin key is only `id`; search / `view_all_page_id` URLs fall through to set. No scraper, API, or helper script. Does not block.
  - Regression: six-step skill, media path rules, failed-fetch continue, and later pipeline files are unchanged. Media download is scoped to extracted ads. Does not block.
  - Integrity: no TODOs, placeholders, or debug leftovers. Does not block.
  - Documentation: schema notes at-most-one ad for a pinned `id`. README and `systemPatterns.md` stay accurate at their altitude. Does not block.
  - Browser stay-on-URL (advisory): the click-forbid sentence is under the HTTP-blocked fallback. "Exact deeplink" plus "ignore other ads" still covers an unsolicited browser open. Does not block.

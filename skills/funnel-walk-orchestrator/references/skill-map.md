# Skill map

Closed allowlist of [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) used as **judges**. Skills not named here are not selected.

Fetch each selected skill from the raw URL at judgement time. Do not vendor the catalog. Do not distill the skill into a local rewrite.

## Fetch URLs

Base: `https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/<name>/SKILL.md`

| Skill | URL |
| --- | --- |
| `cro` | `https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/cro/SKILL.md` |
| `ad-creative` | `https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/ad-creative/SKILL.md` |
| `popups` | `https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/popups/SKILL.md` |
| `offers` | `https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/offers/SKILL.md` |
| `signup` | `https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/signup/SKILL.md` |

## Selection

| Skill | When it is selected |
| --- | --- |
| `cro` | `kind` is `destination`, `product`, `cart`, or `checkout`. |
| `ad-creative` | `kind` is `destination` and `funnel.json` has a non-empty `ads` array. Invert: judge the existing ad (hook, offer, visual, CTA). Do not generate ads. |
| `popups` | An overlay, modal, cookie gate, or email gate is visible on this hop. |
| `offers` | `kind` is `product` or `cart`, and a priced package, membership, or stacked line-item offer is visible. |
| `signup` | `kind` is `checkout` and an account-creation wall is visible. |

`kind` `blocker` or `other`: select no skills. `judgements` is `[]`.

A skill that is not selected is omitted. Do not run the rest of the marketingskills catalog.

## Subagent contract

Each selected skill runs in its own subagent.

The subagent receives: the fetched skill text, this hop's URL, `kind`, visible copy, screenshot path (when the file exists), and ad records from `funnel.json` when `ads_present`.

The subagent returns one short judgement string about **this page** (or, for `ad-creative`, the existing ad against this destination). It does not interview. It does not rewrite the page. It does not click. It does not fill a form.

If the fetch fails or the subagent fails, the parent records `{ "skill": "<name>", "error": "<reason>" }` and does not invent a `judge`.

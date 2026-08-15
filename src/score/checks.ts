/**
 * Distilled scoring checks. Source material (MIT):
 * https://github.com/coreyhaines31/marketingskills
 * skills: cro, popups, ads (ad-to-landing congruence), cro/references/form.md
 *
 * Not a vendor of those skills. No interview questions, experiment slates,
 * or copy alternatives. Facts the scorer holds while it grades evidence.
 */
export const MARKETING_CHECKS = `## Checks

Skip a check that cannot be seen in the screenshots or bundle. Do not ask the operator questions. Do not invent conversion rates, heatmaps, or tests. Do not write rewrite alternatives.

### message_match
Applies only when meta.ad.creative is present. Otherwise N/A on every stage.
- The landing hero restates the ad's promise in the same words, not a nearby theme.
- The primary landing CTA is the same action the ad asked for.
- If the ad names a product, price, or offer, that thing is visible above the fold on landing.
- If meta.ad.destinationUrl points at a different offer than the landing page (rent vs buy, different SKU), that is a miss.
- Cite the ad screenshot when present (meta.ad.screenshot) plus the landing screenshot.

### value_proposition
- A first-time visitor can say what this is and why it matters from the hero in five seconds.
- Benefit before feature list. Jargon or cleverness that hides the offer is a miss.

### cta
- One primary action above the fold. Competing Shop Now / Rent / Explore is a miss.
- Button copy names the outcome, not Submit or Learn More.
- After add-to-cart, a checkout action stays visible. A success state that removes the buy path is a miss.

### friction
- Pre-selected add-ons, warranties, or plans that raise the price before opt-in are a miss.
- A required membership or recurring fee missing from the running total is a miss.
- Each extra required checkout field costs. Phone required without a reason is a miss.
- Marketing opt-ins that are pre-checked are a miss.

### trust
- Proof (quotes, logos, scores) is actually filled in, attributed, and near the ask. Empty proof modules are a miss.
- The checkout total matches what was promised, including shipping state.

### mobile
- An overlay that covers the hero or primary CTA on first paint is a miss.
- Full-screen mobile overlays, hard-to-dismiss popups, and popups on checkout are a miss.

### performance
- Use only stage timings in the bundle.

### errors
- Use only console and network errors in the bundle. Tracker 404s are medium at most unless they break the page.`;

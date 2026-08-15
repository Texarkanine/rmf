# rmf

Give it a live URL. It opens that site, screenshots the landing page, adds a product, then screenshots the cart and checkout. It does not submit payment.

```bash
npm run capture -- https://tonal.com/
```

Screenshots land in `runs/<id>/artifacts/`. Chromium opens so you can watch it. Pass `HEADLESS=1` to hide the window.

## Walk a funnel

`/walk-the-funnel` runs Playwright against a live URL (`HEADLESS=1 npm run capture -- <url>`), writes `runs/<id>/steps.json`, and prints that hop list. It does not score or roast. A hop that is not the real page (bot wall, challenge, leftover chrome) fails the walk even when the CLI exits 0; the roast stops rather than scoring it.

## Start a roast

`/start-the-roast` runs the full roast in order:

1. Collect a funnel URL and a Meta ads deeplink
2. Fetch the ad (`/get-meta-ad`)
3. Walk the live funnel (`/walk-the-funnel`) and apply the matching marketing rubric at each hop
4. Write the report card (`/write-the-roast`)

A successful run leaves a timestamped directory under `.rmf/` and prints that path plus `report.html`.

## Score

Grok 4.6 reads those screenshots and the capture bundle. It does not browse the live site.

1. Create an API key at [console.x.ai](https://console.x.ai/).
2. Score the run:

```bash
export XAI_API_KEY=xai-...
npm run score -- runs/tonal
```

That writes `runs/tonal/report.json`.

## Visual explainers

This repo vendors the [visual-explainer](https://github.com/nicobailon/visual-explainer) Cursor skill at `.cursor/skills/visual-explainer/`.

Generated pages go in `docs/visual-explainer/`. A GitHub Actions workflow publishes `docs/` to GitHub Pages on every push to `main`.

Site: https://texarkanine.github.io/rmf/

The first deploy needs GitHub Pages set to **GitHub Actions** as the source (`Settings → Pages → Build and deployment → Source`).

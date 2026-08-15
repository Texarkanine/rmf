# rmf

Give it a live URL. It opens that site, screenshots the landing page, adds a product, then screenshots the cart and checkout. It does not submit payment.

```bash
npm run capture -- https://tonal.com/
```

Screenshots land in `runs/<id>/artifacts/`. Chromium opens so you can watch it. Pass `HEADLESS=1` to hide the window.

## Start a roast

`/start-the-roast` collects a funnel URL and a Meta ads deeplink, writes a run under `.rmf/`, and prints that directory path.

## Walk the funnel

`/start-the-funnel` takes that run directory (or a funnel URL) and calls the walk orchestrator. Grok opens the live site in a real browser, walks to checkout page-load, applies selected [marketingskills](https://github.com/coreyhaines31/marketingskills) in subagents at each hop, and appends `walk.jsonl`. It does not submit payment. It does not launch Playwright.

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

# rmf

Give it a live URL. It opens that site, screenshots the landing page, adds a product, then screenshots the cart and checkout. It does not submit payment.

```bash
npm run capture -- https://tonal.com/ --ad-url 'https://www.facebook.com/ads/library/?id=2110273689844971'
```

`--ad-url` is a Meta Ad Library or Google Ads Transparency link. The walker screenshots that ad first, then walks the site. Pass `--ad 'headline and primary text'` if you already have the copy.

Screenshots land in `runs/<id>/artifacts/`. Chromium opens so you can watch it. Pass `HEADLESS=1` to hide the window.

## Score

Grok 4.6 reads those screenshots and the capture bundle. It does not browse the live site.

1. Create an API key at [console.x.ai](https://console.x.ai/). Put it in `.env` as `XAI_API_KEY=xai-...` or export it.
2. Score the run:

```bash
export XAI_API_KEY=xai-...
npm run score -- runs/tonal
```

That writes `runs/tonal/report.json` and `runs/tonal/report.html`. Open the HTML file in a browser; screenshots sit next to each finding.

Rebuild the HTML from an existing score without calling Grok:

```bash
npm run report -- runs/tonal
```

## Visual explainers

This repo vendors the [visual-explainer](https://github.com/nicobailon/visual-explainer) Cursor skill at `.cursor/skills/visual-explainer/`.

Generated pages go in `docs/visual-explainer/`. A GitHub Actions workflow publishes `docs/` to GitHub Pages on every push to `main`.

Site: https://texarkanine.github.io/rmf/

The first deploy needs GitHub Pages set to **GitHub Actions** as the source (`Settings → Pages → Build and deployment → Source`).

# rmf

Give it a live URL and an ad. It walks landing → cart → checkout (no payment), scores the screenshots, and opens a pithy HTML roast.

```bash
npm run roast -- https://tonal.com/ --ad-url 'https://www.facebook.com/ads/library/?id=2110273689844971'
```

`--ad-url` is a Meta Ad Library or Google Ads Transparency link. The walker screenshots that ad first, then walks the site. Pass `--ad 'headline and primary text'` if you already have the copy. Pass `--no-open` to skip the browser.

Put an xAI key in `.env` as `XAI_API_KEY=xai-...` ([console.x.ai](https://console.x.ai/)). Chromium opens so you can watch the walk; `HEADLESS=1` hides it.

The run lands in `runs/<id>/` (`bundle.json`, `report.json`, `report.html`, `artifacts/`).

Pieces, if you want them separate:

```bash
npm run capture -- https://tonal.com/ --ad-url 'https://www.facebook.com/ads/library/?id=2110273689844971'
npm run score -- runs/<id>
npm run report -- runs/<id>
```

## Visual explainers

This repo vendors the [visual-explainer](https://github.com/nicobailon/visual-explainer) Cursor skill at `.cursor/skills/visual-explainer/`.

Generated pages go in `docs/visual-explainer/`. A GitHub Actions workflow publishes `docs/` to GitHub Pages on every push to `main`.

Site: https://texarkanine.github.io/rmf/

The first deploy needs GitHub Pages set to **GitHub Actions** as the source (`Settings → Pages → Build and deployment → Source`).

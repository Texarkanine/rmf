# rmf

Give it a live URL. It opens that site, screenshots the landing page, adds a product, then screenshots the cart and checkout. It does not submit payment.

```bash
npm run capture -- https://tonal.com/
```

Screenshots land in `runs/<id>/artifacts/`. Chromium opens so you can watch it. Pass `HEADLESS=1` to hide the window.

## Score

Grok 4.6 reads those screenshots and the capture bundle. It does not browse the live site.

1. Create an API key at [console.x.ai](https://console.x.ai/).
2. Score the run:

```bash
export XAI_API_KEY=xai-...
npm run score -- runs/tonal
```

That writes `runs/tonal/report.json`.

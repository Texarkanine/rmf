# Tech Context

TypeScript CLI: Playwright captures a live funnel; Grok 4.6 scores the evidence bundle offline via xAI. Product behavior is defined in [`prd.md`](../prd.md). This file points at how to work in the repo; it does not list every flag or dependency.

## Environment Setup

- Node + npm. Dependencies are in `package.json`.
- Playwright Chromium for capture. Windowed by default so the walk is visible; `HEADLESS=1` hides it.
- Scoring needs `XAI_API_KEY` from [console.x.ai](https://console.x.ai/). Capture does not.
- Capture output is gitignored under `runs/`.

## Build Tools

- TypeScript (`tsconfig.json`, NodeNext) run through `tsx` — there is no required compile step for the CLI.
- npm scripts in `package.json`: `capture` and `score`.
- Docs in `docs/` publish to GitHub Pages via `.github/workflows/pages.yml`. Visual explainers go in `docs/visual-explainer/` per `.cursor/rules/visual-explainer.mdc`.

## Testing Process

Unit tests use Node's built-in `node:test` runner via `tsx`, configured as the `test` script in `package.json`. A live `capture` run against the target store remains the acceptance check for the walker.

## Design System

No token file or component library. The visual product is the HTML report card and the generated LP still. Taste/art direction of the mock is a human ownership item in `prd.md`, not a design-system package.

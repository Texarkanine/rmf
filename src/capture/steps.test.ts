import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CaptureBundle, StageEvidence } from "../types.js";
import { toSteps } from "./steps.js";

function stage(partial: Partial<StageEvidence> & Pick<StageEvidence, "name" | "url">): StageEvidence {
  return {
    redirects: ["https://tracker.example/a -> https://tracker.example/b"],
    timings: { stageMs: 10, interactions: [] },
    screenshot: `artifacts/${partial.name}.png`,
    mobileScreenshot: `artifacts/${partial.name}.mobile.png`,
    dom: `artifacts/${partial.name}.dom.html`,
    visibleCopy: "a lot of page copy that must not appear in steps.json",
    ctas: [
      {
        text: "Shop Now",
        tag: "a",
        href: "https://tonal.com/products/tonal-2",
        box: { x: 0, y: 0, width: 1, height: 1, aboveFold: true },
      },
    ],
    forms: [],
    paymentUiDetected: false,
    consoleErrors: ["boom"],
    networkErrors: ["404 https://example/pixel"],
    aiFallbackUsed: [],
    ...partial,
  };
}

const bundle: CaptureBundle = {
  meta: {
    startUrl: "https://tonal.com/",
    capturedAt: "2026-08-15T19:17:01.327Z",
    runId: "tonal-walk-3",
    userAgent: "HeadlessChrome",
    viewport: { width: 1280, height: 720 },
    delayMs: 800,
    modelPin: "grok-4.6",
  },
  stoppedBeforePayment: true,
  stages: [
    stage({ name: "landing", url: "https://tonal.com/" }),
    stage({
      name: "add_to_cart",
      url: "https://tonal.com/products/tonal-2",
      timings: {
        stageMs: 10,
        interactions: [{ intent: "open_product", durationMs: 100 }],
      },
    }),
    stage({
      name: "checkout",
      url: "https://tonal.com/checkouts/cn/abc",
      paymentUiDetected: true,
      timings: {
        stageMs: 10,
        interactions: [{ intent: "go_to_checkout", durationMs: 0 }],
      },
    }),
  ],
};

describe("toSteps", () => {
  it("keeps one hop per stage with intents and payment flag", () => {
    const steps = toSteps(bundle);
    assert.equal(steps.startUrl, "https://tonal.com/");
    assert.equal(steps.stoppedBeforePayment, true);
    assert.deepEqual(
      steps.steps.map((step) => ({
        name: step.name,
        url: step.url,
        intents: step.intents,
        paymentUiDetected: step.paymentUiDetected,
        screenshot: step.screenshot,
      })),
      [
        {
          name: "landing",
          url: "https://tonal.com/",
          intents: [],
          paymentUiDetected: false,
          screenshot: "artifacts/landing.png",
        },
        {
          name: "add_to_cart",
          url: "https://tonal.com/products/tonal-2",
          intents: ["open_product"],
          paymentUiDetected: false,
          screenshot: "artifacts/add_to_cart.png",
        },
        {
          name: "checkout",
          url: "https://tonal.com/checkouts/cn/abc",
          intents: ["go_to_checkout"],
          paymentUiDetected: true,
          screenshot: "artifacts/checkout.png",
        },
      ],
    );
  });

  it("omits copy, ctas, redirects, and errors", () => {
    const json = JSON.stringify(toSteps(bundle));
    assert.equal(json.includes("a lot of page copy"), false);
    assert.equal(json.includes("tracker.example"), false);
    assert.equal(json.includes("Shop Now"), false);
    assert.equal(json.includes("boom"), false);
  });
});

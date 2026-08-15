import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Browser, Page } from "@playwright/test";
import type { ActionLayer, AdContext, CaptureBundle, FunnelIntent, StageEvidence } from "../types.js";
import { PINNED_MODEL } from "../score/grades.js";
import { captureStage } from "./evidence.js";
import { attachObservers } from "./observe.js";
import { dismissOverlays } from "./overlays.js";
import { CompositeActionLayer, HeuristicActionLayer } from "./resolve.js";
import { assertUrlAllowed } from "./robots.js";

export interface CaptureOptions {
  startUrl: string;
  outDir: string;
  runId: string;
  ad?: AdContext;
  delayMs?: number;
  /**
   * Optional AI resolver used only after heuristics fail.
   * It must not grade pages or decide when to stop.
   */
  actionLayerFactory?: (page: Page) => ActionLayer;
}

type PageKind = "product" | "cart" | "checkout" | "other";

async function sleep(ms: number): Promise<void> {
  if (ms <= 0) {
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function classifyPage(url: string): PageKind {
  const path = new URL(url).pathname.toLowerCase();
  if (/\/checkouts?\b/.test(path)) {
    return "checkout";
  }
  if (/\/cart\b/.test(path)) {
    return "cart";
  }
  if (/\/products?\//.test(path)) {
    return "product";
  }
  return "other";
}

/**
 * True when the URL is a cart or checkout page, not a PDP leftover.
 */
/**
 * Shopify cart lives at /cart on the current origin.
 */
export function storeCartUrl(currentUrl: string): string {
  return new URL("/cart", currentUrl).href;
}

export function isReachedCart(url: string): boolean {
  const kind = classifyPage(url);
  return kind === "cart" || kind === "checkout";
}

/**
 * True when the URL looks like a payment-complete / paid confirmation page.
 */
export function isPaymentCompleteUrl(url: string): boolean {
  return /\/paid(\.html)?/i.test(url);
}

/**
 * True when visible copy shows a post-purchase thank-you.
 */
export function isThankYouCopy(copy: string): boolean {
  return /thank you for your (order|purchase)/i.test(copy);
}

export async function captureFunnel(
  browser: Browser,
  options: CaptureOptions,
): Promise<CaptureBundle> {
  await assertUrlAllowed(options.startUrl);
  const delayMs = options.delayMs ?? 500;
  const runDir = path.join(options.outDir, options.runId);
  const artifactsDir = path.join(runDir, "artifacts");
  await mkdir(artifactsDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();
  const observers = attachObservers(page);
  const aiFallbackUsed: FunnelIntent[] = [];
  const heuristic = new HeuristicActionLayer(page);
  const fallback = options.actionLayerFactory?.(page);
  const actions = fallback
    ? new CompositeActionLayer(heuristic, fallback, (intent) => {
        aiFallbackUsed.push(intent);
      })
    : heuristic;

  const stages: StageEvidence[] = [];

  const interact = async (intent: FunnelIntent, description: string) => {
    await dismissOverlays(page);
    const started = Date.now();
    const ok = await actions.click(intent, description);
    if (!ok) {
      throw new Error(`Could not resolve ${intent}`);
    }
    await sleep(delayMs);
    return { intent, durationMs: Date.now() - started };
  };

  const record = async (
    name: StageEvidence["name"],
    interactions: StageEvidence["timings"]["interactions"],
  ) => {
    await dismissOverlays(page);
    const started = Date.now();
    stages.push(
      await captureStage({
        page,
        name,
        artifactsDir,
        observers,
        stageStartedAt: started,
        interactions,
        aiFallbackUsed: [...aiFallbackUsed],
      }),
    );
  };

  try {
    await page.goto(options.startUrl, { waitUntil: "domcontentloaded" });
    await dismissOverlays(page);
    await sleep(delayMs);
    await record("landing", []);

    let kind = classifyPage(page.url());
    const productHops: StageEvidence["timings"]["interactions"] = [];
    for (let hop = 0; hop < 3 && kind === "other"; hop += 1) {
      productHops.push(
        await interact("open_product", "Open a product that can be added to the cart"),
      );
      kind = classifyPage(page.url());
    }
    await record("add_to_cart", productHops);

    kind = classifyPage(page.url());
    const cartInteractions: StageEvidence["timings"]["interactions"] = [];
    if (kind !== "cart" && kind !== "checkout") {
      cartInteractions.push(
        await interact("add_to_cart", "Add the displayed product to the cart"),
      );
      kind = classifyPage(page.url());
    }
    if (kind !== "cart" && kind !== "checkout") {
      const opened = await actions.click(
        "open_cart",
        "Open the cart page after adding a product",
      );
      if (opened) {
        cartInteractions.push({ intent: "open_cart", durationMs: 0 });
        kind = classifyPage(page.url());
      }
      if (kind !== "cart" && kind !== "checkout") {
        await page.goto(storeCartUrl(page.url()), {
          waitUntil: "domcontentloaded",
        });
        cartInteractions.push({ intent: "open_cart", durationMs: 0 });
        kind = classifyPage(page.url());
      }
    }
    await sleep(delayMs);
    await record("cart", cartInteractions);

    const checkoutInteractions: StageEvidence["timings"]["interactions"] = [];
    if (kind !== "checkout") {
      const opened = await actions.click("go_to_checkout", "Open the checkout page");
      if (opened) {
        checkoutInteractions.push({
          intent: "go_to_checkout",
          durationMs: 0,
        });
      } else {
        await page.goto(new URL("/checkout", page.url()).href, {
          waitUntil: "domcontentloaded",
        });
      }
      kind = classifyPage(page.url());
    }
    await record("checkout", checkoutInteractions);

    const landing = stages.find((stage) => stage.name === "landing");
    const cart = stages.find((stage) => stage.name === "cart");
    const checkout = stages.at(-1);
    if (!cart || !isReachedCart(cart.url)) {
      throw new Error(`Never reached a cart page (last URL: ${cart?.url ?? "none"})`);
    }
    if (!checkout || classifyPage(checkout.url) === "other") {
      throw new Error(`Never reached checkout (last URL: ${checkout?.url ?? "none"})`);
    }
    if (landing && checkout.url === landing.url) {
      throw new Error("Checkout screenshot is still the landing page");
    }
    if (isPaymentCompleteUrl(checkout.url)) {
      throw new Error("Capture reached a payment-complete page");
    }
    if (isThankYouCopy(checkout.visibleCopy)) {
      throw new Error("Capture submitted payment");
    }

    const bundle: CaptureBundle = {
      meta: {
        startUrl: options.startUrl,
        ad: options.ad,
        capturedAt: new Date().toISOString(),
        runId: options.runId,
        userAgent: await page.evaluate(() => navigator.userAgent),
        viewport: { width: 1280, height: 720 },
        delayMs,
        modelPin: PINNED_MODEL,
      },
      stages,
      stoppedBeforePayment: true,
    };
    await writeFile(path.join(runDir, "bundle.json"), JSON.stringify(bundle, null, 2));
    return bundle;
  } finally {
    observers.dispose();
    await context.close();
  }
}

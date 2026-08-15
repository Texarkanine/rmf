import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Page } from "@playwright/test";
import type {
  CtaRecord,
  FormRecord,
  StageEvidence,
  StageName,
} from "../types.js";
import { snapshotAndClear, type PageObservers } from "./observe.js";

export const PAYMENT_IFRAME_HOST =
  /checkout\.shopify\.com|js\.stripe\.com|paypal\.com|braintreegateway\.com|adyen\.com/i;

export interface PaymentUiPage {
  frames(): Array<{ url(): string }>;
}

/**
 * True when any frame URL matches a known hosted-payment iframe host.
 * This is evidence collection, not a grade.
 */
export async function detectPaymentUi(page: PaymentUiPage): Promise<boolean> {
  return page.frames().some((frame) => PAYMENT_IFRAME_HOST.test(frame.url()));
}

/**
 * True when collected form labels include card-entry fields.
 * Shopify checkout often paints those in the main document, not a known iframe host.
 */
export function hasPaymentFieldLabels(labels: string[]): boolean {
  return labels.some((label) =>
    /credit card|card number|\bcvv\b|\bcvc\b|expiration/i.test(label),
  );
}

export async function collectCtas(page: Page): Promise<CtaRecord[]> {
  const viewport = page.viewportSize() ?? { width: 1280, height: 720 };
  return page.evaluate((viewHeight) => {
    const nodes = [...document.querySelectorAll("a, button, [role='button']")];
    const records: CtaRecord[] = [];
    for (const node of nodes) {
      const el = node as HTMLElement;
      const box = el.getBoundingClientRect();
      const text = (el.innerText || el.getAttribute("aria-label") || "").trim();
      if (!text || box.width === 0 || box.height === 0) {
        continue;
      }
      records.push({
        text: text.slice(0, 200),
        tag: el.tagName.toLowerCase(),
        href: el instanceof HTMLAnchorElement ? el.href : undefined,
        box: {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          aboveFold: box.y < viewHeight && box.bottom > 0,
        },
      });
    }
    return records;
  }, viewport.height);
}

export async function collectForms(page: Page): Promise<FormRecord[]> {
  return page.evaluate(() => {
    return [...document.querySelectorAll("form")].map((form) => {
      const controls = [...form.querySelectorAll("input, select, textarea")].filter(
        (el) => {
          const type = (el as HTMLInputElement).type;
          return type !== "hidden" && type !== "submit";
        },
      );
      const fields = controls.map((el) => {
        const input = el as HTMLInputElement;
        const labelled = input.id
          ? form.querySelector(`label[for="${CSS.escape(input.id)}"]`)
          : el.closest("label");
        const label =
          labelled?.textContent?.trim() ||
          input.getAttribute("aria-label") ||
          input.placeholder ||
          input.name ||
          input.type;
        return {
          label,
          name: input.name || undefined,
          type: input.type || el.tagName.toLowerCase(),
          required: Boolean(input.required),
        };
      });
      const copy = form.innerText.toLowerCase();
      return {
        fieldCount: fields.length,
        labels: fields.map((field) => field.label),
        requiredCount: fields.filter((field) => field.required).length,
        fields,
        forcedAccountCreation: /create (an )?account|sign up to continue|register to/.test(
          copy,
        ),
      };
    });
  });
}

export async function captureStage(input: {
  page: Page;
  name: StageName;
  artifactsDir: string;
  observers: PageObservers;
  stageStartedAt: number;
  interactions: StageEvidence["timings"]["interactions"];
  aiFallbackUsed: StageEvidence["aiFallbackUsed"];
}): Promise<StageEvidence> {
  const { page, name, artifactsDir, observers, stageStartedAt } = input;
  await mkdir(artifactsDir, { recursive: true });

  const screenshotRel = `artifacts/${name}.png`;
  const mobileRel = `artifacts/${name}.mobile.png`;
  const domRel = `artifacts/${name}.dom.html`;

  await page.screenshot({
    path: path.join(artifactsDir, `${name}.png`),
    fullPage: true,
  });

  const visibleCopy = (await page.locator("body").innerText()).slice(0, 20_000);
  const ctas = await collectCtas(page);
  const forms = await collectForms(page);
  const html = await page.content();
  await writeFile(path.join(artifactsDir, `${name}.dom.html`), html);

  const previous = page.viewportSize() ?? { width: 1280, height: 720 };
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: path.join(artifactsDir, `${name}.mobile.png`),
    fullPage: true,
  });
  await page.setViewportSize(previous);

  let navigationMs: number | undefined;
  try {
    navigationMs = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      return nav ? nav.loadEventEnd - nav.startTime : undefined;
    });
  } catch {
    navigationMs = undefined;
  }

  const errors = snapshotAndClear(observers);
  return {
    name,
    url: page.url(),
    redirects: errors.redirects,
    timings: {
      navigationMs,
      stageMs: Date.now() - stageStartedAt,
      interactions: input.interactions,
    },
    screenshot: screenshotRel,
    mobileScreenshot: mobileRel,
    dom: domRel,
    visibleCopy,
    ctas,
    forms,
    paymentUiDetected:
      (await detectPaymentUi(page)) ||
      hasPaymentFieldLabels(forms.flatMap((form) => form.labels)),
    consoleErrors: errors.consoleErrors,
    networkErrors: errors.networkErrors,
    aiFallbackUsed: input.aiFallbackUsed,
  };
}

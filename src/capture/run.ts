import { chromium } from "@playwright/test";
import type { CaptureBundle } from "../types.js";
import { captureFunnel, type CaptureOptions } from "./funnel.js";

export async function runCapture(
  options: CaptureOptions,
): Promise<CaptureBundle> {
  const headless = process.env.HEADLESS === "1";
  const browser = await chromium.launch({ headless });
  try {
    return await captureFunnel(browser, options);
  } finally {
    await browser.close();
  }
}

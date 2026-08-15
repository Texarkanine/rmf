import path from "node:path";
import type { Page } from "@playwright/test";
import type { AdContext } from "../types.js";

const CHROME_LINE =
  /^(library id|started running|see ad details|link to ad|this ad is from|active|close|cancel|sponsored|system status|subscribe to email|about ads|privacy|terms|cookies|faq|this ad has multiple versions)/i;

const JUNK_DESTINATION =
  /facebook\.com|fb\.com|google\.com|meta\.com|metastatus\.com|instagram\.com/i;

export function isAdLibraryUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "facebook.com" || host === "fb.com") {
      return url.pathname.includes("/ads/library");
    }
    return host === "adstransparency.google.com";
  } catch {
    return false;
  }
}

function linesFrom(text: string): string {
  const seen = new Set<string>();
  const kept: string[] = [];
  for (const raw of text.split(/\n+/)) {
    const textLine = raw.replace(/\s+/g, " ").trim();
    if (textLine.length < 16 || textLine.length > 400 || CHROME_LINE.test(textLine)) {
      continue;
    }
    const key = textLine.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    kept.push(textLine);
    if (kept.length >= 6) {
      break;
    }
  }
  return kept.join("\n");
}

async function waitForLoadingGone(page: Page): Promise<void> {
  const loading = page.getByRole("dialog").filter({ hasText: /loading/i });
  try {
    await loading.waitFor({ state: "hidden", timeout: 40_000 });
  } catch {
    // Details may still be usable behind a stuck spinner.
  }
}

export async function captureAdLibrary(
  page: Page,
  libraryUrl: string,
  artifactsDir: string,
): Promise<AdContext> {
  await page.goto(libraryUrl, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await waitForLoadingGone(page);
  await page
    .getByRole("dialog")
    .filter({ hasText: /library id|sponsored|this ad is from/i })
    .first()
    .waitFor({ timeout: 20_000 })
    .catch(() => undefined);

  const screenshotRel = "artifacts/ad.png";
  const screenshotPath = path.join(artifactsDir, "ad.png");
  const detailsDialog = page
    .getByRole("dialog")
    .filter({ hasText: /library id|sponsored|this ad is from/i })
    .first();
  if (await detailsDialog.isVisible().catch(() => false)) {
    await detailsDialog.screenshot({ path: screenshotPath });
  } else {
    await page.screenshot({ path: screenshotPath, fullPage: false });
  }

  const extracted = await page.evaluate(() => {
    const dialogs = [...document.querySelectorAll('[role="dialog"]')] as HTMLElement[];
    const usable =
      dialogs.find((el) => /library id|sponsored|this ad is from/i.test(el.innerText)) ??
      dialogs.find((el) => !/^\s*loading/i.test(el.innerText));
    const root = usable ?? (document.querySelector('[role="main"]') as HTMLElement | null) ?? document.body;
    const links = [...root.querySelectorAll("a[href]")].map((el) => (el as HTMLAnchorElement).href);
    return { text: root.innerText || "", links };
  });
  const creative = linesFrom(extracted.text);
  const destinationUrl = extracted.links.find(
    (href) => href.startsWith("http") && !JUNK_DESTINATION.test(href),
  );
  return {
    libraryUrl,
    screenshot: screenshotRel,
    ...(creative ? { creative } : {}),
    ...(destinationUrl ? { destinationUrl } : {}),
  };
}

export function mergeAdContext(base: AdContext | undefined, captured: AdContext): AdContext {
  return {
    ...captured,
    ...base,
    screenshot: captured.screenshot ?? base?.screenshot,
    creative: base?.creative || captured.creative,
    destinationUrl: base?.destinationUrl || captured.destinationUrl,
    libraryUrl: base?.libraryUrl || captured.libraryUrl,
  };
}

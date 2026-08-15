import type { Page } from "@playwright/test";

const CONSENT_NAMES = [
  /accept all/i,
  /accept cookies/i,
  /i agree/i,
  /got it/i,
  /^accept$/i,
];

const CLOSE_NAMES = [
  /^close$/i,
  /no thanks/i,
  /not now/i,
  /dismiss/i,
  /maybe later/i,
];

async function clickIfVisible(
  page: Page,
  role: "button" | "link",
  name: RegExp,
): Promise<boolean> {
  const locator = page.getByRole(role, { name }).first();
  if (!(await locator.isVisible())) {
    return false;
  }
  try {
    await locator.click({ timeout: 1000 });
    return true;
  } catch {
    return false;
  }
}

async function dismissOnce(page: Page): Promise<boolean> {
  for (const name of CONSENT_NAMES) {
    if (await clickIfVisible(page, "button", name)) {
      return true;
    }
  }
  for (const name of CLOSE_NAMES) {
    if (await clickIfVisible(page, "button", name)) {
      return true;
    }
  }

  const dialog = page.getByRole("dialog").first();
  if (await dialog.isVisible()) {
    await page.keyboard.press("Escape");
    return true;
  }
  return false;
}

/**
 * Clear cookie banners and marketing modals that intercept clicks
 * (including Klaviyo-style email popups).
 */
export async function dismissOverlays(page: Page): Promise<void> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    if (!(await dismissOnce(page))) {
      return;
    }
  }
}

import type { Page } from "@playwright/test";
import type { ActionLayer, FunnelIntent } from "../types.js";

export const PAYMENT_SUBMIT =
  /place order|pay now|submit payment|complete purchase|confirm (order|purchase|payment)/i;

type RolePattern = { role: "button" | "link"; name: RegExp };

const PATTERNS: Record<FunnelIntent, RolePattern[]> = {
  dismiss_overlay: [
    { role: "button", name: /accept all/i },
    { role: "button", name: /accept cookies/i },
    { role: "button", name: /^accept$/i },
    { role: "button", name: /got it/i },
    { role: "button", name: /i agree/i },
  ],
  open_product: [
    { role: "link", name: /shop now/i },
    { role: "link", name: /view (product|details)/i },
    { role: "link", name: /buy now/i },
  ],
  add_to_cart: [
    { role: "button", name: /add to (cart|bag|basket)/i },
  ],
  open_cart: [
    { role: "button", name: /your cart/i },
    { role: "link", name: /your cart|view cart|shopping (cart|bag)/i },
    { role: "link", name: /^cart$/i },
    { role: "button", name: /view cart/i },
  ],
  go_to_checkout: [
    { role: "link", name: /proceed to checkout/i },
    { role: "link", name: /^checkout$/i },
    { role: "button", name: /^(proceed to )?checkout$/i },
  ],
};

export class HeuristicActionLayer implements ActionLayer {
  constructor(private readonly page: Page) {}

  async click(intent: FunnelIntent, _description: string): Promise<boolean> {
    if (intent === "open_product") {
      return this.openProduct();
    }
    if (intent === "add_to_cart") {
      return this.addToCart();
    }
    if (intent === "open_cart") {
      if (await this.clickHref(/\/cart(\?|$|\/)/)) {
        return true;
      }
    }
    if (intent === "go_to_checkout") {
      if (await this.clickHref(/\/checkouts?\b/)) {
        return true;
      }
    }

    for (const pattern of PATTERNS[intent]) {
      if (await this.clickRole(pattern.role, pattern.name)) {
        return true;
      }
    }
    return false;
  }

  private async openProduct(): Promise<boolean> {
    const links = this.page.locator("a[href*='/products/']");
    const count = await links.count();
    for (let i = 0; i < count; i += 1) {
      const link = links.nth(i);
      const href = (await link.getAttribute("href")) ?? "";
      if (/purchase_type=rent/i.test(href)) {
        continue;
      }
      if (!(await link.isVisible())) {
        continue;
      }
      await link.click();
      await this.page.waitForLoadState("domcontentloaded").catch(() => undefined);
      return true;
    }
    return this.clickRole("link", /shop now/i);
  }

  private async addToCart(): Promise<boolean> {
    const button = this.page.getByRole("button", { name: /add to (cart|bag|basket)/i }).first();
    if (await button.isVisible()) {
      try {
        await button.click({ timeout: 5000 });
        await this.page.waitForLoadState("domcontentloaded").catch(() => undefined);
        return true;
      } catch {
        try {
          await button.click({ force: true, timeout: 3000 });
          return true;
        } catch {
          // Fall through to the Shopify cart endpoint when the click is blocked.
        }
      }
    }
    return this.addViaShopifyAjax();
  }

  private async addViaShopifyAjax(): Promise<boolean> {
    const handle = new URL(this.page.url()).pathname.split("/products/")[1]?.split("/")[0];
    if (!handle) {
      return false;
    }
    try {
      await this.page.evaluate(async (productHandle) => {
        const productResponse = await fetch(`/products/${productHandle}.js`);
        if (!productResponse.ok) {
          throw new Error(`product.js ${productResponse.status}`);
        }
        const product = (await productResponse.json()) as { variants: Array<{ id: number }> };
        const addResponse = await fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: product.variants[0].id, quantity: 1 }),
        });
        if (!addResponse.ok) {
          throw new Error(`cart/add.js ${addResponse.status}`);
        }
      }, handle);
      return true;
    } catch {
      return false;
    }
  }

  private async clickRole(role: "button" | "link", name: RegExp): Promise<boolean> {
    const locator = this.page.getByRole(role, { name }).first();
    try {
      await locator.waitFor({ state: "visible", timeout: 2500 });
      const text = (await locator.innerText()).trim();
      if (PAYMENT_SUBMIT.test(text)) {
        return false;
      }
      await locator.click();
      await this.page.waitForLoadState("domcontentloaded").catch(() => undefined);
      return true;
    } catch {
      return false;
    }
  }

  private async clickHref(pattern: RegExp): Promise<boolean> {
    const links = this.page.locator("a[href]");
    const count = await links.count();
    for (let i = 0; i < Math.min(count, 40); i += 1) {
      const link = links.nth(i);
      const href = (await link.getAttribute("href")) ?? "";
      if (!pattern.test(href) || !(await link.isVisible())) {
        continue;
      }
      await link.click();
      await this.page.waitForLoadState("domcontentloaded").catch(() => undefined);
      return true;
    }
    return false;
  }
}

export class CompositeActionLayer implements ActionLayer {
  constructor(
    private readonly primary: ActionLayer,
    private readonly fallback?: ActionLayer,
    private readonly onFallback?: (intent: FunnelIntent) => void,
  ) {}

  async click(intent: FunnelIntent, description: string): Promise<boolean> {
    if (await this.primary.click(intent, description)) {
      return true;
    }
    if (!this.fallback) {
      return false;
    }
    this.onFallback?.(intent);
    return this.fallback.click(intent, description);
  }
}

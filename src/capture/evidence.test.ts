import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { detectPaymentUi } from "./evidence.js";

function pageWithFrames(urls: string[]): { frames: () => Array<{ url: () => string }> } {
  return {
    frames: () => urls.map((url) => ({ url: () => url })),
  };
}

describe("detectPaymentUi", () => {
  it("returns true when a frame URL matches a known payment host", async () => {
    const hosts = [
      "https://checkout.shopify.com/cards",
      "https://js.stripe.com/v3/",
      "https://www.paypal.com/smart/buttons",
      "https://payments.braintreegateway.com/hosted-fields",
      "https://checkoutshopper-live.adyen.com/checkout",
    ];
    for (const url of hosts) {
      assert.equal(
        await detectPaymentUi(pageWithFrames([url])),
        true,
        url,
      );
    }
  });

  it("returns false when no frame matches a payment host", async () => {
    assert.equal(
      await detectPaymentUi(pageWithFrames(["https://tonal.com/checkouts/cn/abc"])),
      false,
    );
    assert.equal(await detectPaymentUi(pageWithFrames([])), false);
  });
});

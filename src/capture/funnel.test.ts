import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyPage,
  isPaymentCompleteUrl,
  isReachedCart,
  isThankYouCopy,
} from "./funnel.js";

describe("classifyPage", () => {
  it("classifies the Tonal PDP as product", () => {
    assert.equal(classifyPage("https://tonal.com/products/tonal-2"), "product");
  });

  it("classifies the Tonal cart as cart", () => {
    assert.equal(classifyPage("https://tonal.com/cart"), "cart");
  });

  it("classifies a Shopify checkout path as checkout", () => {
    assert.equal(
      classifyPage("https://tonal.com/checkouts/cn/abc"),
      "checkout",
    );
  });

  it("classifies a hosted Shop checkout as checkout", () => {
    assert.equal(
      classifyPage("https://shop.app/checkout/cn/abc"),
      "checkout",
    );
  });
});

describe("isReachedCart", () => {
  it("accepts cart and checkout URLs", () => {
    assert.equal(isReachedCart("https://tonal.com/cart"), true);
    assert.equal(isReachedCart("https://tonal.com/checkouts/cn/abc"), true);
  });

  it("rejects the Tonal PDP and homepage", () => {
    assert.equal(
      isReachedCart("https://tonal.com/products/tonal-2?variant=49151847006490"),
      false,
    );
    assert.equal(isReachedCart("https://tonal.com/"), false);
  });
});

describe("payment-stop guards", () => {
  it("treats a /paid URL as payment-complete", () => {
    assert.equal(isPaymentCompleteUrl("https://tonal.com/paid"), true);
    assert.equal(isPaymentCompleteUrl("https://tonal.com/paid.html"), true);
    assert.equal(isPaymentCompleteUrl("https://tonal.com/cart"), false);
  });

  it("treats thank-you copy as a submitted payment", () => {
    assert.equal(isThankYouCopy("Thank you for your order"), true);
    assert.equal(isThankYouCopy("thank you for your purchase"), true);
    assert.equal(isThankYouCopy("Enter your payment details"), false);
  });
});

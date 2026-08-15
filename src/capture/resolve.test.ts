import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PAYMENT_SUBMIT } from "./resolve.js";

describe("PAYMENT_SUBMIT", () => {
  it("matches place-order and pay-now labels", () => {
    assert.equal(PAYMENT_SUBMIT.test("Place order"), true);
    assert.equal(PAYMENT_SUBMIT.test("Pay now"), true);
    assert.equal(PAYMENT_SUBMIT.test("Complete purchase"), true);
  });

  it("does not match Checkout", () => {
    assert.equal(PAYMENT_SUBMIT.test("Checkout"), false);
    assert.equal(PAYMENT_SUBMIT.test("Proceed to checkout"), false);
  });
});

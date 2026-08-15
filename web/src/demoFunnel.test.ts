import { describe, expect, it } from "vitest";
import {
  DEMO_FUNNEL_URL,
  resultsPath,
  scanPath,
  toFunnelUrl,
} from "./demoFunnel";

describe("demo funnel destination", () => {
  it("always sends the Tonal report through the grill", () => {
    expect(DEMO_FUNNEL_URL).toBe("https://tonal.com/");
    expect(toFunnelUrl("https://yourstore.com")).toBe(DEMO_FUNNEL_URL);
    expect(toFunnelUrl("https://tonal.com")).toBe(DEMO_FUNNEL_URL);
    expect(toFunnelUrl("https://www.tonal.com/products/tonal-2")).toBe(
      DEMO_FUNNEL_URL,
    );
    expect(toFunnelUrl(null)).toBe(DEMO_FUNNEL_URL);
    expect(scanPath("https://example.com")).toBe(
      `/scan?url=${encodeURIComponent(DEMO_FUNNEL_URL)}`,
    );
    expect(resultsPath("https://example.com")).toBe(
      `/results?url=${encodeURIComponent(DEMO_FUNNEL_URL)}`,
    );
  });
});

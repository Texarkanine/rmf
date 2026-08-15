import { describe, expect, it } from "vitest";
import { mockReport } from "./mockReport";
import { tapeShots, triageCards } from "./setList";

const GYM_REPLACEMENT =
  "Everything you need to replace traditional gym machines like squat rack, free weights, and more—in one sleek, wall-mounted system.";

describe("Tonal demo report", () => {
  it("roasts the captured Meta ad, not a different creative", () => {
    expect(mockReport.storeUrl).toBe("https://tonal.com/");
    expect(mockReport.ad.libraryId).toBe("2110273689844971");
    expect(mockReport.ad.primaryText).toBe(GYM_REPLACEMENT);
    expect(mockReport.ad.headline).toBe("Shop Tonal 2 now");
    expect(mockReport.ad.destinationUrl).toBe("https://tonal.com/");
    expect(mockReport.ad.cta).toBe("Learn More");

    const roastText = [
      mockReport.verdict,
      mockReport.leak,
      ...mockReport.findings.map((finding) => `${finding.punchline} ${finding.diagnosis}`),
    ].join(" ");
    expect(roastText.toLowerCase()).not.toMatch(/pilates/);
    expect(roastText.toLowerCase()).not.toMatch(/get strong\. stay strong/);
  });

  it("walks the five captured stages with receipts", () => {
    expect(mockReport.funnel.map((node) => node.stage)).toEqual([
      "ads",
      "landing",
      "product",
      "cart",
      "checkout",
    ]);
    for (const node of mockReport.funnel) {
      expect(node.screenshot).toMatch(/^\/assets\/demo\//);
      expect(node.status).toBe("observed");
    }
    expect(mockReport.funnel[1]?.promise.toLowerCase()).toContain(
      "ultimate strength training system",
    );
    expect(mockReport.funnel[4]?.promise).toMatch(/\$5,215/);
  });

  it("keeps the four ad frames from the library capture", () => {
    expect(mockReport.ad.frames.map((frame) => frame.label)).toEqual([
      "0s",
      "3s",
      "8s",
      "last",
    ]);
    expect(mockReport.ad.frames[1]?.overlay).toMatch(/GET IT ALL ON YOUR/i);
    expect(mockReport.ad.frames[2]?.overlay).toMatch(/STRENGTH, CARDIO/i);
  });
});

describe("results page helpers", () => {
  it("fills triage from the report's first actions", () => {
    const cards = triageCards(mockReport);
    expect(cards).toHaveLength(3);
    expect(cards[0]?.title).toBe("Fix now");
    expect(cards[0]?.note).toBe(mockReport.firstActions[0]);
    expect(cards[1]?.note).toBe(mockReport.firstActions[1]);
    expect(cards[2]?.note).toBe(mockReport.firstActions[2]);
  });

  it("puts the 3s ad frame, homepage, and checkout on the tape", () => {
    const shots = tapeShots(mockReport);
    expect(shots).toHaveLength(3);
    expect(shots[0]?.src).toBe("/assets/demo/ad-03s.png");
    expect(shots[1]?.src).toBe("/assets/demo/landing.png");
    expect(shots[2]?.src).toBe("/assets/demo/checkout.png");
  });
});

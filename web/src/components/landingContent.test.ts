import { describe, expect, it } from "vitest";
import {
  DEFAULT_ROAST_URL,
  PEPPER_SCALE,
  SAMPLE_HEAT,
  TAPE_ROASTS,
} from "./landingContent";

describe("landing sample content", () => {
  it("defaults the grill to the Tonal demo funnel", () => {
    expect(DEFAULT_ROAST_URL).toBe("https://tonal.com/");
  });

  it("rates heat on a five-pepper scale with empty peppers visible", () => {
    expect(PEPPER_SCALE).toBe(5);
    expect(SAMPLE_HEAT).toHaveLength(4);
    for (const row of SAMPLE_HEAT) {
      expect(row.score).toBeGreaterThanOrEqual(1);
      expect(row.score).toBeLessThanOrEqual(PEPPER_SCALE);
    }
    expect(SAMPLE_HEAT.some((row) => row.score < PEPPER_SCALE)).toBe(true);
  });

  it("pairs each tape roast with a short second line", () => {
    expect(TAPE_ROASTS).toHaveLength(3);
    for (const roast of TAPE_ROASTS) {
      expect(roast.n).toBeGreaterThan(0);
      expect(roast.title.length).toBeGreaterThan(0);
      expect(roast.punch.length).toBeGreaterThan(0);
      expect(roast.note.length).toBeGreaterThan(0);
    }
  });
});

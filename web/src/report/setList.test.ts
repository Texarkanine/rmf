import { describe, expect, it } from "vitest";
import {
  addToSetList,
  buildDesignerBrief,
  buildImplementationPrompt,
  buildWritersBrief,
  chiliCount,
  crowdKillers,
  findingById,
  markFixed,
  moveTask,
  reopenTask,
  seedSetList,
  tasksIn,
  withStoreUrl,
} from "./setList";
import type { Finding, RoastReport } from "./types";

function finding(overrides: Partial<Finding> = {}): Finding {
  return {
    id: "f-promise",
    stage: "landing",
    title: "The promise disappears after the click",
    punchline: "Your ad promised overnight glow. Your landing page opened with the founder’s autobiography.",
    diagnosis: "The main promise from the ad disappears on the destination page.",
    whyItMatters: "This may increase uncertainty after the click.",
    fix: "Repeat the ad’s main promise in the hero.",
    showMe: {
      headline: "Wake up glowing. Overnight.",
      copy: "The same serum from the ad, on the first screen.",
      instructions: "Replace the homepage hero headline and subhead.",
    },
    impact: "high",
    effort: "low",
    confidence: "high",
    owner: "copy",
    priority: "fix_before_spend",
    evidence: "observed",
    screenshot: "/assets/tape-landing.png",
    hotspot: "underline",
    defaultQueue: "fix_now",
    test: {
      hypothesis: "Matching the ad promise in the hero will lift add-to-cart.",
      change: "Swap the greeting headline for the ad promise.",
      kpi: "Landing-page to add-to-cart rate",
      guardrail: "Bounce rate",
      success: "Add-to-cart rate improves without a bounce-rate spike.",
    },
    ...overrides,
  };
}

function report(overrides: Partial<RoastReport> = {}): RoastReport {
  const findings = overrides.findings ?? [
    finding(),
    finding({ id: "f-shipping", stage: "checkout", defaultQueue: "fix_now" }),
    finding({ id: "f-proof", defaultQueue: "test_next" }),
  ];
  return {
    storeName: "Glow Formula",
    storeUrl: "https://glowformula.com",
    scannedAt: "2026-08-15",
    verdict: "Ads know. Landing forgot.",
    leak: "Message match after the click.",
    strongest: "Creative.",
    firstActions: ["Rewrite the hero"],
    coverage: ["Meta ad", "Landing page"],
    confidence: "High on what is on the page. Unverified on revenue impact.",
    overallScore: 58,
    overallLabel: "Needs better material.",
    categories: [],
    funnel: [],
    mismatches: [],
    crowdKillerIds: ["f-promise", "f-shipping", "f-proof"],
    writersRoom: [
      {
        id: "w-headline",
        kind: "headline",
        title: "Homepage H1",
        before: "THE ULTIMATE STRENGTH TRAINING SYSTEM",
        after: "Get strong. Stay strong. On your wall.",
      },
    ],
    nextSet: [],
    scorecards: [],
    ...overrides,
    findings,
  };
}

describe("seedSetList", () => {
  it("creates one open task per finding in that finding's default queue", () => {
    const state = seedSetList([
      finding({ id: "a", defaultQueue: "fix_now" }),
      finding({ id: "b", defaultQueue: "test_next" }),
      finding({ id: "c", defaultQueue: "later" }),
    ]);
    expect(state.tasks).toEqual([
      { id: "a", category: "fix_now", status: "open" },
      { id: "b", category: "test_next", status: "open" },
      { id: "c", category: "later", status: "open" },
    ]);
  });
});

describe("addToSetList", () => {
  it("adds a missing finding to Fix Now", () => {
    const next = addToSetList({ tasks: [] }, "f-new");
    expect(next.tasks).toEqual([
      { id: "f-new", category: "fix_now", status: "open" },
    ]);
  });

  it("moves an existing task and reopens it", () => {
    const next = addToSetList(
      { tasks: [{ id: "f-new", category: "later", status: "fixed" }] },
      "f-new",
      "test_next",
    );
    expect(next.tasks).toEqual([
      { id: "f-new", category: "test_next", status: "open" },
    ]);
  });
});

describe("moveTask and markFixed", () => {
  it("moves a task between categories without changing status", () => {
    const next = moveTask(
      { tasks: [{ id: "a", category: "fix_now", status: "open" }] },
      "a",
      "dismissed",
    );
    expect(next.tasks[0]).toEqual({
      id: "a",
      category: "dismissed",
      status: "open",
    });
  });

  it("ignores unknown task ids", () => {
    const start = {
      tasks: [{ id: "a", category: "fix_now" as const, status: "open" as const }],
    };
    expect(moveTask(start, "missing", "later")).toEqual(start);
    expect(markFixed(start, "missing")).toEqual(start);
  });

  it("marks a task fixed and can reopen it", () => {
    const fixed = markFixed(
      { tasks: [{ id: "a", category: "fix_now", status: "open" }] },
      "a",
    );
    expect(fixed.tasks[0].status).toBe("fixed");
    expect(reopenTask(fixed, "a").tasks[0].status).toBe("open");
  });
});

describe("tasksIn", () => {
  it("returns only tasks in the requested category, in list order", () => {
    const state = {
      tasks: [
        { id: "a", category: "fix_now" as const, status: "open" as const },
        { id: "b", category: "later" as const, status: "open" as const },
        { id: "c", category: "fix_now" as const, status: "fixed" as const },
      ],
    };
    expect(tasksIn(state, "fix_now").map((task) => task.id)).toEqual(["a", "c"]);
  });
});

describe("prompts", () => {
  it("builds an implementation prompt with punchline, fix, and show-me copy", () => {
    const prompt = buildImplementationPrompt(finding());
    expect(prompt).toContain("The promise disappears after the click");
    expect(prompt).toContain("Repeat the ad’s main promise in the hero.");
    expect(prompt).toContain("Wake up glowing. Overnight.");
    expect(prompt).toContain("Landing-page to add-to-cart rate");
  });

  it("builds a designer brief with owner, stage, and diagnosis", () => {
    const brief = buildDesignerBrief(finding());
    expect(brief).toContain("Owner: Copy");
    expect(brief).toContain("Stage: Landing Page");
    expect(brief).toContain("The main promise from the ad disappears");
    expect(brief).toContain("Fix Before Spending More");
  });
});

describe("report helpers", () => {
  it("returns crowd killers in the report's listed order", () => {
    const r = report({
      findings: [
        finding({ id: "f-proof" }),
        finding({ id: "f-promise" }),
        finding({ id: "f-shipping" }),
      ],
    });
    expect(crowdKillers(r).map((item) => item.id)).toEqual([
      "f-promise",
      "f-shipping",
      "f-proof",
    ]);
  });

  it("looks up a finding by id", () => {
    expect(findingById(report(), "f-promise")?.stage).toBe("landing");
    expect(findingById(report(), "missing")).toBeUndefined();
  });

  it("overlays a scanned store URL when one is provided", () => {
    const next = withStoreUrl(report(), "https://tonal.com/");
    expect(next.storeUrl).toBe("https://tonal.com/");
    expect(withStoreUrl(report(), null).storeUrl).toBe("https://glowformula.com");
    expect(withStoreUrl(report(), "not a url").storeUrl).toBe("https://glowformula.com");
  });

  it("maps a 0-100 score onto three chili peppers", () => {
    expect(chiliCount(20)).toBe(1);
    expect(chiliCount(58)).toBe(2);
    expect(chiliCount(80)).toBe(3);
  });

  it("builds a writers-room brief from before/after copy", () => {
    const brief = buildWritersBrief(report());
    expect(brief).toContain("Implementation brief · Glow Formula");
    expect(brief).toContain("Ads know. Landing forgot.");
    expect(brief).toContain("Before: THE ULTIMATE STRENGTH TRAINING SYSTEM");
    expect(brief).toContain("After: Get strong. Stay strong. On your wall.");
  });
});

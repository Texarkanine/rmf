import { RUBRIC_DIMENSIONS, STAGE_NAMES, type CaptureBundle } from "../types.js";
import { MARKETING_CHECKS } from "./checks.js";

export const SCORING_SYSTEM_PROMPT = `You score a conversion-funnel capture. You work offline on the evidence bundle and screenshots provided in this request. You do not browse. You do not fetch URLs. You do not open a live page.

Findings are one or two sentences a marketer can act on. Sharp and specific. Not a CRO memo.

## Output

Return one JSON object. No markdown. No commentary outside JSON.

Shape:
{
  "stages": {
    "<stage>": {
      "grades": { "<dimension>": "A"|"B"|"C"|"D"|"F"|"N/A" },
      "findings": [
        {
          "severity": "high"|"medium"|"low",
          "stage": "<stage>",
          "dimension": "<dimension>",
          "summary": "<specific issue or win>",
          "screenshot": "<path exactly as it appears in the bundle>"
        }
      ]
    }
  }
}

Stages: ${STAGE_NAMES.join(", ")}.
Dimensions: ${RUBRIC_DIMENSIONS.join(", ")}.

## Steps

1. Read the bundle JSON and the attached screenshots. Treat those as the only facts.
2. For each stage, assign every dimension a letter grade.
3. Use N/A only for message_match when the bundle has no ad creative, and for a dimension that cannot apply to that stage.
4. Write findings that a marketer can act on. Each finding must set screenshot to a path on that stage (screenshot or mobileScreenshot), or to meta.ad.screenshot when the finding is about the ad.
5. Stop. Do not invent pages, CTAs, or errors that are not in the evidence.

## Rubric

- message_match: ad creative and destination versus landing copy and hero.
- value_proposition: whether a first-time visitor can tell what is sold and why it matters.
- cta: prominence, count, and competition among primary actions.
- friction: extra steps, required fields, forced account creation.
- trust: guarantees, security marks, recognizable brand proof.
- mobile: layout of the mobile screenshot — clipping, overflow, tap targets.
- performance: stage timings and load cost in the bundle.
- errors: console and network errors recorded for the stage.

${MARKETING_CHECKS}
`;

export function evidenceForScoring(bundle: CaptureBundle): unknown {
  return {
    meta: {
      startUrl: bundle.meta.startUrl,
      ad: bundle.meta.ad,
      capturedAt: bundle.meta.capturedAt,
      viewport: bundle.meta.viewport,
      delayMs: bundle.meta.delayMs,
    },
    stoppedBeforePayment: bundle.stoppedBeforePayment,
    stages: bundle.stages.map((stage) => ({
      name: stage.name,
      url: stage.url,
      screenshot: stage.screenshot,
      mobileScreenshot: stage.mobileScreenshot,
      visibleCopy: stage.visibleCopy.slice(0, 4000),
      ctas: stage.ctas.slice(0, 20).map((cta) => ({
        text: cta.text,
        tag: cta.tag,
        href: cta.href,
        aboveFold: cta.box.aboveFold,
      })),
      forms: stage.forms,
      timings: stage.timings,
      consoleErrors: stage.consoleErrors.slice(0, 20),
      networkErrors: stage.networkErrors
        .filter((row) => !/doubleclick|linkedin|adnxs|adsrvr|trkn/i.test(row))
        .slice(0, 20),
    })),
  };
}

export function buildScoringUserPrompt(bundleJson: string): string {
  return `Score this capture bundle. Cite screenshot paths that appear in the bundle. Do not browse.

${bundleJson}
`;
}

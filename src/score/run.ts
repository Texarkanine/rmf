import { readFile } from "node:fs/promises";
import path from "node:path";
import type { AuditReport, CaptureBundle, LlmClient } from "../types.js";
import { PINNED_MODEL } from "./grades.js";
import { assembleReport, parseModelGrades } from "./parse.js";
import { buildScoringUserPrompt, evidenceForScoring, SCORING_SYSTEM_PROMPT } from "./prompt.js";
import { xaiClient } from "./xai.js";

export async function scoreBundle(
  bundle: CaptureBundle,
  client: LlmClient,
  artifactRoot: string,
): Promise<AuditReport> {
  const images: Array<{ path: string; mimeType: string; base64: string }> = [];
  for (const stage of bundle.stages) {
    for (const relative of [stage.screenshot, stage.mobileScreenshot]) {
      const abs = path.join(artifactRoot, relative);
      try {
        const bytes = await readFile(abs);
        images.push({
          path: relative,
          mimeType: "image/png",
          base64: bytes.toString("base64"),
        });
      } catch {
        // Scoring still runs on JSON when screenshot files are absent (unit tests).
      }
    }
  }

  const raw = await client.complete({
    system: SCORING_SYSTEM_PROMPT,
    user: buildScoringUserPrompt(JSON.stringify(evidenceForScoring(bundle), null, 2)),
    images,
  });
  return assembleReport(bundle, parseModelGrades(raw));
}

export async function runScore(bundleDir: string): Promise<AuditReport> {
  const bundlePath = path.join(bundleDir, "bundle.json");
  const bundle = JSON.parse(await readFile(bundlePath, "utf8")) as CaptureBundle;
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error("XAI_API_KEY is required to score");
  }
  const report = await scoreBundle(bundle, xaiClient(apiKey), bundleDir);
  if (report.model !== PINNED_MODEL) {
    throw new Error(`refusing to emit a report for unpinned model ${report.model}`);
  }
  return report;
}

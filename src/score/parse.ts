import {
  RUBRIC_DIMENSIONS,
  STAGE_NAMES,
  type AuditReport,
  type CaptureBundle,
  type Finding,
  type LetterGrade,
  type RubricDimension,
  type StageGrades,
  type StageName,
} from "../types.js";
import {
  letterFromScore,
  overallFromStageScores,
  PINNED_MODEL,
  scoreFromGrades,
} from "./grades.js";

const LETTERS = new Set<LetterGrade>(["A", "B", "C", "D", "F", "N/A"]);
const SEVERITY_RANK = { high: 0, medium: 1, low: 2 } as const;

type ParsedStage = {
  grades: Record<RubricDimension, LetterGrade>;
  findings: Finding[];
};

export type ParsedModelGrades = {
  stages: Record<StageName, ParsedStage>;
  findings: Finding[];
};

function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end < 0) {
    throw new Error("model did not return JSON");
  }
  return JSON.parse(trimmed.slice(start, end + 1)) as unknown;
}

function asFinding(value: unknown, fallbackStage: StageName): Finding {
  const row = value as Partial<Finding>;
  if (
    (row.severity !== "high" && row.severity !== "medium" && row.severity !== "low") ||
    !row.dimension ||
    !row.summary ||
    !row.screenshot
  ) {
    throw new Error("invalid finding");
  }
  return {
    severity: row.severity,
    stage: (row.stage as StageName | undefined) ?? fallbackStage,
    dimension: row.dimension,
    summary: row.summary,
    screenshot: row.screenshot,
  };
}

export function parseModelGrades(raw: string): ParsedModelGrades {
  const parsed = extractJson(raw) as {
    stages?: Record<string, { grades?: Record<string, string>; findings?: unknown[] }>;
  };
  if (!parsed.stages) {
    throw new Error("model JSON missing stages");
  }
  const stages = {} as Record<StageName, ParsedStage>;
  const findings: Finding[] = [];
  for (const name of STAGE_NAMES) {
    const stage = parsed.stages[name];
    if (!stage?.grades) {
      throw new Error(`model JSON missing grades for ${name}`);
    }
    const grades = {} as Record<RubricDimension, LetterGrade>;
    for (const dimension of RUBRIC_DIMENSIONS) {
      const letter = stage.grades[dimension] as LetterGrade | undefined;
      if (!letter || !LETTERS.has(letter)) {
        throw new Error(`invalid grade for ${name}.${dimension}`);
      }
      grades[dimension] = letter;
    }
    const stageFindings = (stage.findings ?? []).map((item) => asFinding(item, name));
    stages[name] = { grades, findings: stageFindings };
    findings.push(...stageFindings);
  }
  return { stages, findings };
}

export function assembleReport(
  bundle: CaptureBundle,
  parsed: ParsedModelGrades,
): AuditReport {
  const screenshots = new Set(
    bundle.stages.flatMap((stage) => [stage.screenshot, stage.mobileScreenshot]),
  );
  const stages = {} as Record<StageName, StageGrades>;

  for (const name of STAGE_NAMES) {
    const raw = parsed.stages[name];
    if (!raw) {
      throw new Error(`missing stage ${name}`);
    }
    for (const finding of raw.findings) {
      if (!screenshots.has(finding.screenshot)) {
        throw new Error(
          `finding cites screenshot not in the bundle: ${finding.screenshot}`,
        );
      }
    }
    const score = scoreFromGrades(raw.grades);
    stages[name] = {
      grades: raw.grades,
      score,
      grade: letterFromScore(score),
      findings: raw.findings,
    };
  }

  const overallScore = overallFromStageScores(
    Object.fromEntries(
      STAGE_NAMES.map((name) => [name, stages[name].score]),
    ) as Record<StageName, number>,
  );
  const findings = [...parsed.findings].sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
  );

  return {
    model: PINNED_MODEL,
    stages,
    overall: { score: overallScore, grade: letterFromScore(overallScore) },
    findings,
  };
}

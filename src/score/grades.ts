import {
  RUBRIC_DIMENSIONS,
  STAGE_NAMES,
  type LetterGrade,
  type RubricDimension,
  type StageName,
} from "../types.js";

/** Pinned scoring model. Changing this is a grading-policy change. */
export const PINNED_MODEL = "grok-4.6";

export const LETTER_TO_SCORE: Record<Exclude<LetterGrade, "N/A">, number> = {
  A: 95,
  B: 85,
  C: 75,
  D: 65,
  F: 40,
};

export const DIMENSION_WEIGHTS: Record<RubricDimension, number> = {
  message_match: 0.15,
  value_proposition: 0.15,
  cta: 0.15,
  friction: 0.15,
  trust: 0.1,
  mobile: 0.1,
  performance: 0.1,
  errors: 0.1,
};

export const STAGE_WEIGHTS: Record<StageName, number> = {
  landing: 0.3,
  add_to_cart: 0.25,
  cart: 0.2,
  checkout: 0.25,
};

export function letterToScore(grade: LetterGrade): number | null {
  if (grade === "N/A") {
    return null;
  }
  return LETTER_TO_SCORE[grade];
}

export function letterFromScore(score: number): Exclude<LetterGrade, "N/A"> {
  if (score >= 90) {
    return "A";
  }
  if (score >= 80) {
    return "B";
  }
  if (score >= 70) {
    return "C";
  }
  if (score >= 60) {
    return "D";
  }
  return "F";
}

export function scoreFromGrades(
  grades: Record<RubricDimension, LetterGrade>,
): number {
  const applicable = RUBRIC_DIMENSIONS.filter((dimension) => grades[dimension] !== "N/A");
  const totalWeight = applicable.reduce(
    (sum, dimension) => sum + DIMENSION_WEIGHTS[dimension],
    0,
  );
  if (totalWeight === 0) {
    return 0;
  }
  let acc = 0;
  for (const dimension of applicable) {
    const numeric = letterToScore(grades[dimension]);
    if (numeric === null) {
      continue;
    }
    acc += numeric * (DIMENSION_WEIGHTS[dimension] / totalWeight);
  }
  return acc;
}

export function overallFromStageScores(
  scores: Record<StageName, number>,
): number {
  return STAGE_NAMES.reduce(
    (sum, name) => sum + scores[name] * STAGE_WEIGHTS[name],
    0,
  );
}

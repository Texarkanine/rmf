export const STAGE_NAMES = [
  "landing",
  "add_to_cart",
  "cart",
  "checkout",
] as const;

export type StageName = (typeof STAGE_NAMES)[number];

export const RUBRIC_DIMENSIONS = [
  "message_match",
  "value_proposition",
  "cta",
  "friction",
  "trust",
  "mobile",
  "performance",
  "errors",
] as const;

export type RubricDimension = (typeof RUBRIC_DIMENSIONS)[number];

export type LetterGrade = "A" | "B" | "C" | "D" | "F" | "N/A";

export type FunnelIntent =
  | "dismiss_overlay"
  | "open_product"
  | "add_to_cart"
  | "open_cart"
  | "go_to_checkout";

export interface AdContext {
  libraryUrl?: string;
  creative?: string;
  destinationUrl?: string;
  screenshot?: string;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
  aboveFold: boolean;
}

export interface CtaRecord {
  text: string;
  tag: string;
  href?: string;
  box: Box;
}

export interface FormFieldRecord {
  label: string;
  name?: string;
  type: string;
  required: boolean;
}

export interface FormRecord {
  fieldCount: number;
  labels: string[];
  requiredCount: number;
  fields: FormFieldRecord[];
  forcedAccountCreation: boolean;
}

export interface StageTimings {
  navigationMs?: number;
  stageMs: number;
  interactions: Array<{ intent: FunnelIntent; durationMs: number }>;
}

export interface StageEvidence {
  name: StageName;
  url: string;
  redirects: string[];
  timings: StageTimings;
  screenshot: string;
  mobileScreenshot: string;
  dom: string;
  visibleCopy: string;
  ctas: CtaRecord[];
  forms: FormRecord[];
  consoleErrors: string[];
  networkErrors: string[];
  aiFallbackUsed: FunnelIntent[];
}

export interface CaptureBundle {
  meta: {
    startUrl: string;
    ad?: AdContext;
    capturedAt: string;
    runId: string;
    userAgent: string;
    viewport: { width: number; height: number };
    delayMs: number;
    modelPin: string;
  };
  stages: StageEvidence[];
  stoppedBeforePayment: true;
}

export interface Finding {
  severity: "high" | "medium" | "low";
  stage: StageName;
  dimension: RubricDimension;
  summary: string;
  screenshot: string;
}

export interface StageGrades {
  grades: Record<RubricDimension, LetterGrade>;
  score: number;
  grade: Exclude<LetterGrade, "N/A">;
  findings: Finding[];
}

export interface AuditReport {
  model: string;
  stages: Record<StageName, StageGrades>;
  overall: { score: number; grade: Exclude<LetterGrade, "N/A"> };
  findings: Finding[];
}

export interface LlmClient {
  complete(input: {
    system: string;
    user: string;
    images: Array<{ path: string; mimeType: string; base64: string }>;
  }): Promise<string>;
}

/**
 * AI action layer used only to resolve an element when heuristics fail.
 * It must not decide whether a stage passed or what grade to assign.
 */
export interface ActionLayer {
  click(intent: FunnelIntent, description: string): Promise<boolean>;
}

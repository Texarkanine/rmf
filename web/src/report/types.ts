export const FUNNEL_STAGES = [
  "ads",
  "landing",
  "product",
  "cart",
  "checkout",
] as const;

export type FunnelStage = (typeof FUNNEL_STAGES)[number];

export type Owner = "copy" | "creative" | "design" | "development";

export type Intensity = "high" | "medium" | "low";

export type EvidenceKind = "observed" | "inferred" | "unverified";

export type InspectionStatus = "observed" | "inferred" | "not_inspected";

export type PriorityLabel =
  | "fix_before_spend"
  | "high_value_test"
  | "worth_cleaning"
  | "not_hurting";

export type SetListCategory = "fix_now" | "test_next" | "later" | "dismissed";

export type TaskStatus = "open" | "fixed";

export type HotspotKind = "circle" | "underline" | "shipping";

export interface CategoryScore {
  id: string;
  label: string;
  score: number;
}

export interface FunnelNode {
  id: string;
  stage: FunnelStage | "thankyou";
  label: string;
  url: string;
  screenshot: string | null;
  promise: string;
  score: number | null;
  issueCount: number;
  status: InspectionStatus;
}

export interface Mismatch {
  id: string;
  from: string;
  to: string;
  summary: string;
}

export interface FindingTest {
  hypothesis: string;
  change: string;
  kpi: string;
  guardrail: string;
  success: string;
}

export interface FindingShowMe {
  headline?: string;
  copy?: string;
  sectionOrder?: string[];
  instructions?: string;
}

export interface Finding {
  id: string;
  stage: FunnelStage;
  title: string;
  punchline: string;
  diagnosis: string;
  whyItMatters: string;
  fix: string;
  showMe: FindingShowMe;
  impact: Intensity;
  effort: Intensity;
  confidence: Intensity;
  owner: Owner;
  priority: PriorityLabel;
  evidence: EvidenceKind;
  screenshot: string | null;
  hotspot?: HotspotKind;
  defaultQueue: SetListCategory;
  test: FindingTest;
}

export interface WritersItem {
  id: string;
  kind: "headline" | "cta" | "proof" | "offer" | "order" | "before_after";
  title: string;
  before?: string;
  after: string;
}

export interface NextSetItem {
  when: "today" | "week" | "later";
  text: string;
  findingId?: string;
}

export interface ScorecardMetric {
  label: string;
  value: 1 | 2 | 3 | 4 | 5;
  kind: "stars" | "chili";
}

export interface ScorecardColumn {
  id: string;
  title: string;
  metrics: ScorecardMetric[];
  keyFinding: string;
}

export interface RoastReport {
  storeName: string;
  storeUrl: string;
  scannedAt: string;
  verdict: string;
  leak: string;
  strongest: string;
  firstActions: string[];
  coverage: string[];
  confidence: string;
  overallScore: number;
  overallLabel: string;
  categories: CategoryScore[];
  funnel: FunnelNode[];
  mismatches: Mismatch[];
  findings: Finding[];
  crowdKillerIds: string[];
  writersRoom: WritersItem[];
  nextSet: NextSetItem[];
  scorecards: ScorecardColumn[];
}

export interface SetListTask {
  id: string;
  category: SetListCategory;
  status: TaskStatus;
}

export interface SetListState {
  tasks: SetListTask[];
}

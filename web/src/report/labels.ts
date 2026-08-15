import type {
  EvidenceKind,
  FunnelStage,
  InspectionStatus,
  Intensity,
  Owner,
  PriorityLabel,
  SetListCategory,
} from "./types";

export const STAGE_LABELS: Record<FunnelStage | "thankyou", string> = {
  ads: "Ads",
  landing: "Landing Page",
  product: "Product Page",
  cart: "Cart",
  checkout: "Checkout",
  thankyou: "Thank You",
};

export const PRIORITY_LABELS: Record<PriorityLabel, string> = {
  fix_before_spend: "Fix Before Spending More",
  high_value_test: "High-Value Test",
  worth_cleaning: "Worth Cleaning Up",
  not_hurting: "Not Hurting Enough Yet",
};

export const QUEUE_LABELS: Record<SetListCategory, string> = {
  fix_now: "Fix Now",
  test_next: "Test Next",
  later: "Later",
  dismissed: "Dismissed",
};

export const OWNER_LABELS: Record<Owner, string> = {
  copy: "Copy",
  creative: "Creative",
  design: "Design",
  development: "Development",
};

export const INTENSITY_LABELS: Record<Intensity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const EVIDENCE_LABELS: Record<EvidenceKind, string> = {
  observed: "Observed",
  inferred: "Inferred",
  unverified: "Unverified",
};

export const INSPECTION_LABELS: Record<InspectionStatus, string> = {
  observed: "Observed",
  inferred: "Inferred",
  not_inspected: "Not Inspected",
};

export const OWNER_BUTTON: Record<Owner, string> = {
  copy: "Copy",
  creative: "Try",
  design: "Design",
  development: "Dev",
};

export const NAV_SECTIONS = [
  { id: "verdict", label: "Tonight’s Verdict" },
  { id: "funnel", label: "Funnel Map" },
  { id: "crowd", label: "Top Issues" },
  { id: "tape", label: "Let’s Review the Tape" },
  { id: "ads", label: "Ads" },
  { id: "landing", label: "Landing Page" },
  { id: "product", label: "Product Page" },
  { id: "cart", label: "Cart" },
  { id: "checkout", label: "Checkout" },
  { id: "writers", label: "Writers’ Room" },
  { id: "next", label: "Test Plan" },
] as const;

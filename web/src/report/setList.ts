import {
  OWNER_LABELS,
  PRIORITY_LABELS,
  STAGE_LABELS,
} from "./labels";
import type {
  Finding,
  RoastReport,
  SetListCategory,
  SetListState,
  SetListTask,
} from "./types";

function mapTask(
  state: SetListState,
  taskId: string,
  update: (task: SetListTask) => SetListTask,
): SetListState {
  let found = false;
  const tasks = state.tasks.map((task) => {
    if (task.id !== taskId) return task;
    found = true;
    return update(task);
  });
  return found ? { tasks } : state;
}

export function seedSetList(findings: Finding[]): SetListState {
  return {
    tasks: findings.map((finding) => ({
      id: finding.id,
      category: finding.defaultQueue,
      status: "open" as const,
    })),
  };
}

export function addToSetList(
  state: SetListState,
  findingId: string,
  category: SetListCategory = "fix_now",
): SetListState {
  const existing = state.tasks.some((task) => task.id === findingId);
  if (existing) {
    return {
      tasks: state.tasks.map((task) =>
        task.id === findingId
          ? { ...task, category, status: "open" }
          : task,
      ),
    };
  }
  return {
    tasks: [
      ...state.tasks,
      { id: findingId, category, status: "open" },
    ],
  };
}

export function moveTask(
  state: SetListState,
  taskId: string,
  category: SetListCategory,
): SetListState {
  return mapTask(state, taskId, (task) => ({ ...task, category }));
}

export function markFixed(state: SetListState, taskId: string): SetListState {
  return mapTask(state, taskId, (task) => ({ ...task, status: "fixed" }));
}

export function reopenTask(state: SetListState, taskId: string): SetListState {
  return mapTask(state, taskId, (task) => ({ ...task, status: "open" }));
}

export function tasksIn(
  state: SetListState,
  category: SetListCategory,
): SetListState["tasks"] {
  return state.tasks.filter((task) => task.category === category);
}

export function buildImplementationPrompt(finding: Finding): string {
  const lines = [
    `Implement this funnel fix: ${finding.title}`,
    "",
    `Punchline: ${finding.punchline}`,
    `Diagnosis: ${finding.diagnosis}`,
    `Fix: ${finding.fix}`,
  ];
  if (finding.showMe.headline) {
    lines.push(`Suggested headline: ${finding.showMe.headline}`);
  }
  if (finding.showMe.copy) {
    lines.push(`Suggested copy: ${finding.showMe.copy}`);
  }
  if (finding.showMe.sectionOrder?.length) {
    lines.push(`Section order: ${finding.showMe.sectionOrder.join(" → ")}`);
  }
  if (finding.showMe.instructions) {
    lines.push(`Instructions: ${finding.showMe.instructions}`);
  }
  lines.push(
    "",
    "Test plan",
    `Hypothesis: ${finding.test.hypothesis}`,
    `Change: ${finding.test.change}`,
    `Primary KPI: ${finding.test.kpi}`,
    `Guardrail: ${finding.test.guardrail}`,
    `Success: ${finding.test.success}`,
  );
  return lines.join("\n");
}

export function buildDesignerBrief(finding: Finding): string {
  return [
    finding.title,
    `Owner: ${OWNER_LABELS[finding.owner]}`,
    `Stage: ${STAGE_LABELS[finding.stage]}`,
    `Priority: ${PRIORITY_LABELS[finding.priority]}`,
    `Impact ${finding.impact} · Effort ${finding.effort} · Confidence ${finding.confidence}`,
    "",
    finding.diagnosis,
    "",
    `Recommended fix: ${finding.fix}`,
  ].join("\n");
}

export function crowdKillers(report: RoastReport): Finding[] {
  return report.crowdKillerIds
    .map((id) => findingById(report, id))
    .filter((item): item is Finding => Boolean(item));
}

export function findingById(
  report: RoastReport,
  id: string,
): Finding | undefined {
  return report.findings.find((finding) => finding.id === id);
}

export function withStoreUrl(
  report: RoastReport,
  url: string | null | undefined,
): RoastReport {
  if (!url) return report;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname) return report;
    return { ...report, storeUrl: parsed.toString() };
  } catch {
    return report;
  }
}

export function chiliCount(score: number): 1 | 2 | 3 {
  if (score >= 70) return 3;
  if (score >= 40) return 2;
  return 1;
}

/**
 * A pasteable brief from the Writers' Room before/after lines,
 * plus the verdict and leak so a designer has context.
 */
export function buildWritersBrief(report: RoastReport): string {
  const lines = [
    `Implementation brief · ${report.storeName}`,
    report.verdict,
    "",
    "Biggest leak",
    report.leak,
    "",
    "Copy and layout",
  ];
  for (const item of report.writersRoom) {
    lines.push("", item.title);
    if (item.before) {
      lines.push(`Before: ${item.before}`);
    }
    lines.push(`After: ${item.after}`);
  }
  return `${lines.join("\n")}\n`;
}

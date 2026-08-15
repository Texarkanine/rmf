import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  STAGE_NAMES,
  type AdContext,
  type AuditReport,
  type CaptureBundle,
  type Finding,
  type LetterGrade,
  type RubricDimension,
  type StageName,
} from "../types.js";

const STAGE_LABEL: Record<StageName, string> = {
  landing: "Landing",
  add_to_cart: "Product",
  cart: "Cart",
  checkout: "Checkout",
};

const DIMENSION_LABEL: Record<RubricDimension, string> = {
  message_match: "Ad match",
  value_proposition: "Offer",
  cta: "CTA",
  friction: "Friction",
  trust: "Trust",
  mobile: "Mobile",
  performance: "Speed",
  errors: "Errors",
};

const SEVERITY_LABEL = {
  high: "The roast",
  medium: "Also",
  low: "Credit where it's due",
} as const;

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function hostFromUrl(startUrl: string): string {
  try {
    return new URL(startUrl).hostname.replace(/^www\./, "");
  } catch {
    return startUrl;
  }
}

function formatCapturedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

function lede(grade: Exclude<LetterGrade, "N/A">, host: string, highCount: number): string {
  const n = highCount === 1 ? "1 high finding" : `${highCount} high findings`;
  switch (grade) {
    case "A":
      return `${host} mostly holds. Still ${n} before you call it done.`;
    case "B":
      return `${host} is a B. Good enough to ship ads against. Not good enough to ignore. ${n}.`;
    case "C":
      return `${host} is leaking. ${n} before the card form.`;
    case "D":
      return `${host} is a D. Pause the spend until these are fixed. ${n}.`;
    case "F":
      return `${host} is an F. The funnel is the ad waste. ${n}.`;
  }
}

function findingCard(finding: Finding): string {
  const src = escapeHtml(finding.screenshot);
  return `<article class="finding ${finding.severity}">
  <a class="shot" href="${src}">
    <img src="${src}" alt="${escapeHtml(STAGE_LABEL[finding.stage])} screenshot">
  </a>
  <div class="copy">
    <p class="meta"><span class="sev">${finding.severity}</span> · ${escapeHtml(STAGE_LABEL[finding.stage])} · ${escapeHtml(DIMENSION_LABEL[finding.dimension])}</p>
    <p class="summary">${escapeHtml(finding.summary)}</p>
  </div>
</article>`;
}

function findingsSection(severity: Finding["severity"], findings: Finding[]): string {
  const rows = findings.filter((finding) => finding.severity === severity);
  if (rows.length === 0) {
    return "";
  }
  return `<section>
  <h2>${SEVERITY_LABEL[severity]}</h2>
  ${rows.map(findingCard).join("\n")}
</section>`;
}

function adBand(ad: AdContext | undefined): string {
  if (!ad?.creative && !ad?.screenshot && !ad?.libraryUrl) {
    return "";
  }
  const shot = ad.screenshot
    ? `<a class="shot" href="${escapeHtml(ad.screenshot)}"><img src="${escapeHtml(ad.screenshot)}" alt="Ad screenshot"></a>`
    : "";
  const copy = ad.creative ? `<blockquote>${escapeHtml(ad.creative)}</blockquote>` : "";
  const link = ad.libraryUrl
    ? `<p class="when"><a href="${escapeHtml(ad.libraryUrl)}">${escapeHtml(ad.libraryUrl)}</a></p>`
    : "";
  return `<section class="ad">
  <h2>The ad they clicked</h2>
  <article class="finding">
    ${shot}
    <div class="copy">${copy}${link}</div>
  </article>
</section>`;
}

export function renderReportHtml(input: {
  report: AuditReport;
  startUrl: string;
  capturedAt: string;
  ad?: AdContext;
}): string {
  const { report, startUrl, capturedAt } = input;
  const host = hostFromUrl(startUrl);
  const highCount = report.findings.filter((finding) => finding.severity === "high").length;
  const title = `${host} — ${report.overall.grade} | Roast My Funnel`;
  const stages = STAGE_NAMES.map((name) => {
    const stage = report.stages[name];
    return `<div class="stage">
      <span class="stage-name">${escapeHtml(STAGE_LABEL[name])}</span>
      <span class="letter grade-${stage.grade}">${stage.grade}</span>
      <span class="stage-score">${stage.score.toFixed(0)}</span>
    </div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --bg: #141210;
      --ink: #f3ead8;
      --mute: #9a9183;
      --rule: #3a342c;
      --high: #e85d3a;
      --medium: #e0a14a;
      --low: #7a9e6e;
      --grade-A: #c8e09a;
      --grade-B: #ead7a0;
      --grade-C: #e0a14a;
      --grade-D: #e85d3a;
      --grade-F: #ff4d4d;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; background: var(--bg); color: var(--ink); }
    body {
      font: 18px/1.45 "Iowan Old Style", Palatino, "Palatino Linotype", "Times New Roman", serif;
      padding: 2.5rem 1.25rem 4rem;
    }
    .wrap { max-width: 920px; margin: 0 auto; }
    header { border-bottom: 1px solid var(--rule); padding-bottom: 1.25rem; }
    .kicker {
      font: 12px/1.2 ui-monospace, "SF Mono", Menlo, monospace;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--mute);
      margin: 0 0 0.4rem;
    }
    h1 { font-size: 2.4rem; font-weight: 400; letter-spacing: -0.02em; margin: 0; }
    h1 a { color: inherit; text-decoration: none; border-bottom: 1px solid var(--rule); }
    h1 a:hover { border-bottom-color: var(--ink); }
    .when { color: var(--mute); font-size: 0.95rem; margin: 0.4rem 0 0; }
    .hero { display: grid; grid-template-columns: auto 1fr; gap: 1.75rem; align-items: start; padding: 2rem 0; }
    .mark {
      font-size: 8.5rem;
      line-height: 0.8;
      letter-spacing: -0.06em;
      font-weight: 400;
      margin: 0;
    }
    .score { font: 14px/1 ui-monospace, "SF Mono", Menlo, monospace; color: var(--mute); margin: 0.6rem 0 0; }
    .lede { font-size: 1.35rem; margin: 0.35rem 0 0; max-width: 36rem; }
    .grade-A { color: var(--grade-A); }
    .grade-B { color: var(--grade-B); }
    .grade-C { color: var(--grade-C); }
    .grade-D { color: var(--grade-D); }
    .grade-F { color: var(--grade-F); }
    .stages {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border: 1px solid var(--rule);
      margin: 0 0 2.5rem;
    }
    .stage {
      padding: 0.9rem 1rem 1rem;
      border-right: 1px solid var(--rule);
    }
    .stage:last-child { border-right: 0; }
    .stage-name {
      display: block;
      font: 11px/1 ui-monospace, "SF Mono", Menlo, monospace;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--mute);
    }
    .stage .letter { font-size: 2.4rem; line-height: 1.1; }
    .stage-score { color: var(--mute); font: 12px/1 ui-monospace, "SF Mono", Menlo, monospace; }
    h2 {
      font-size: 0.8rem;
      font-family: ui-monospace, "SF Mono", Menlo, monospace;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--mute);
      border-top: 1px solid var(--rule);
      padding-top: 1.4rem;
      margin: 0 0 1rem;
    }
    .finding {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 1.1rem;
      margin: 0 0 1.4rem;
      align-items: start;
    }
    .shot {
      display: block;
      height: 180px;
      overflow: hidden;
      background: #0c0b0a;
      border: 1px solid var(--rule);
    }
    .shot img { width: 100%; display: block; }
    .meta {
      font: 11px/1.3 ui-monospace, "SF Mono", Menlo, monospace;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--mute);
      margin: 0 0 0.4rem;
    }
    .sev { color: var(--ink); }
    .finding.high .sev { color: var(--high); }
    .finding.medium .sev { color: var(--medium); }
    .finding.low .sev { color: var(--low); }
    .summary { margin: 0; }
    .ad blockquote {
      margin: 0;
      font-size: 1.15rem;
      white-space: pre-wrap;
    }
    footer {
      border-top: 1px solid var(--rule);
      margin-top: 2rem;
      padding-top: 1rem;
      color: var(--mute);
      font-size: 0.9rem;
    }
    @media (max-width: 720px) {
      .hero, .finding, .stages { grid-template-columns: 1fr; }
      .mark { font-size: 6rem; }
      .stage { border-right: 0; border-bottom: 1px solid var(--rule); }
      .stage:last-child { border-bottom: 0; }
      .shot { height: 160px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <p class="kicker">Roast My Funnel</p>
      <h1><a href="${escapeHtml(startUrl)}">${escapeHtml(host)}</a></h1>
      <p class="when">Walked ${escapeHtml(formatCapturedAt(capturedAt))} · scored by ${escapeHtml(report.model)} · stopped before payment</p>
    </header>
    <div class="hero">
      <div>
        <p class="mark grade-${report.overall.grade}">${report.overall.grade}</p>
        <p class="score">${report.overall.score.toFixed(1)} / 100</p>
      </div>
      <p class="lede">${escapeHtml(lede(report.overall.grade, host, highCount))}</p>
    </div>
    <div class="stages">${stages}</div>
    ${adBand(input.ad)}
    ${findingsSection("high", report.findings)}
    ${findingsSection("medium", report.findings)}
    ${findingsSection("low", report.findings)}
    <footer>Open this file next to the <code>artifacts/</code> folder. Click a screenshot to see the full capture.</footer>
  </div>
</body>
</html>
`;
}

export async function writeHtmlReport(
  bundleDir: string,
  report?: AuditReport,
): Promise<string> {
  const resolved =
    report ??
    (JSON.parse(await readFile(path.join(bundleDir, "report.json"), "utf8")) as AuditReport);
  const bundle = JSON.parse(
    await readFile(path.join(bundleDir, "bundle.json"), "utf8"),
  ) as CaptureBundle;
  const html = renderReportHtml({
    report: resolved,
    startUrl: bundle.meta.startUrl,
    capturedAt: bundle.meta.capturedAt,
    ad: bundle.meta.ad,
  });
  const out = path.join(bundleDir, "report.html");
  await writeFile(out, html);
  return out;
}

#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { isAdLibraryUrl } from "./capture/ad.js";
import { runCapture } from "./capture/run.js";
import { writeHtmlReport } from "./score/html.js";
import { runScore } from "./score/run.js";
import type { AdContext } from "./types.js";

async function loadDotEnv(): Promise<void> {
  try {
    const text = await readFile(path.join(process.cwd(), ".env"), "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }
      const eq = trimmed.indexOf("=");
      if (eq < 1) {
        continue;
      }
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // Missing .env is fine; the score command still requires XAI_API_KEY.
  }
}

function adFromFlags(flags: Record<string, string>): AdContext | undefined {
  const text = flags["--ad"];
  const url = flags["--ad-url"];
  if (!text && !url) {
    return undefined;
  }
  const ad: AdContext = {};
  if (text) {
    ad.creative = text;
  }
  if (url) {
    if (isAdLibraryUrl(url)) {
      ad.libraryUrl = url;
    } else {
      ad.destinationUrl = url;
    }
  }
  return ad;
}

function parseArgs(argv: string[]): {
  positionals: string[];
  flags: Record<string, string>;
} {
  const positionals: string[] = [];
  const flags: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`missing value for ${arg}`);
      }
      flags[arg] = value;
      i += 1;
      continue;
    }
    positionals.push(arg);
  }
  return { positionals, flags };
}

function usage(): never {
  throw new Error(
    "usage:\n  capture <url> [--ad text] [--ad-url url] [--out dir] [--run-id id] [--delay-ms n]\n  score <bundle-dir>\n  report <bundle-dir>",
  );
}

export async function main(argv: string[] = process.argv.slice(2)): Promise<void> {
  await loadDotEnv();
  const { positionals, flags } = parseArgs(argv);
  const [cmd, target] = positionals;
  if (cmd === "capture") {
    if (!target) {
      usage();
    }
    const outDir = flags["--out"] ?? "runs";
    const runId =
      flags["--run-id"] ?? new Date().toISOString().replace(/[:.]/g, "-");
    const delayMs = Number(flags["--delay-ms"] ?? "500");
    const bundle = await runCapture({
      startUrl: target,
      outDir,
      runId,
      delayMs,
      ad: adFromFlags(flags),
    });
    const runDir = path.join(outDir, runId);
    console.log(runDir);
    if (bundle.meta.ad?.screenshot) {
      console.log(`ad: ${bundle.meta.ad.libraryUrl ?? ""} -> ${path.join(runDir, bundle.meta.ad.screenshot)}`);
    }
    for (const stage of bundle.stages) {
      console.log(`${stage.name}: ${stage.url} -> ${path.join(runDir, stage.screenshot)}`);
    }
    return;
  }
  if (cmd === "score") {
    if (!target) {
      usage();
    }
    const report = await runScore(target);
    await writeFile(
      path.join(target, "report.json"),
      `${JSON.stringify(report, null, 2)}\n`,
    );
    const htmlPath = await writeHtmlReport(target, report);
    console.log(`${report.overall.grade} (${report.overall.score.toFixed(1)})`);
    console.log(htmlPath);
    for (const finding of report.findings) {
      console.log(
        `- [${finding.severity}] ${finding.stage}: ${finding.summary} (${finding.screenshot})`,
      );
    }
    return;
  }
  if (cmd === "report") {
    if (!target) {
      usage();
    }
    const htmlPath = await writeHtmlReport(target);
    console.log(htmlPath);
    return;
  }
  usage();
}

const invoked = process.argv[1]
  ? import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
  : false;
if (invoked) {
  await main();
}

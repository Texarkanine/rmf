#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { runCapture } from "./capture/run.js";
import { runScore } from "./score/run.js";

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
    "usage:\n  capture <url> [--ad text] [--ad-url url] [--out dir] [--run-id id] [--delay-ms n]\n  score <bundle-dir>",
  );
}

export async function main(argv: string[] = process.argv.slice(2)): Promise<void> {
  const { positionals, flags } = parseArgs(argv);
  const [cmd, target] = positionals;
  if (cmd === "capture") {
    if (!target) {
      usage();
    }
    const ad = flags["--ad"];
    const adUrl = flags["--ad-url"];
    const outDir = flags["--out"] ?? "runs";
    const runId =
      flags["--run-id"] ?? new Date().toISOString().replace(/[:.]/g, "-");
    const delayMs = Number(flags["--delay-ms"] ?? "500");
    const bundle = await runCapture({
      startUrl: target,
      outDir,
      runId,
      delayMs,
      ad: ad || adUrl ? { creative: ad, destinationUrl: adUrl } : undefined,
    });
    const runDir = path.join(outDir, runId);
    console.log(runDir);
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
    console.log(`${report.overall.grade} (${report.overall.score.toFixed(1)})`);
    for (const finding of report.findings) {
      console.log(
        `- [${finding.severity}] ${finding.stage}: ${finding.summary} (${finding.screenshot})`,
      );
    }
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

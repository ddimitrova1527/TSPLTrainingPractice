import { existsSync, readdirSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readRequests, writeSummary } from "./io";
import {
  buildCategoryReport,
  buildReport,
  onlyOverdue,
  printCategoryReport,
  printInvalid,
  printReport,
  printReportTable,
} from "./report";
import { validateAll } from "./validation";

// Run with: npx tsx src/main.ts [path] [--only-overdue] [--table]
//   path          a .json file (default: data/requests.json) or a folder (one report per *.json file)
//   --only-overdue  show only requests that are past their SLA
//   --table         print with console.table instead of my own formatting
const args = process.argv.slice(2);
// The project folder (one level above src/). A debugger often starts in another folder,
// so a relative path like data/requests.json must not depend on the current folder.
const PROJECT_ROOT = fileURLToPath(new URL("..", import.meta.url));

// Use the path as given if it exists, otherwise look for it inside the project folder.
function findPath(path: string): string {
  return existsSync(path) ? path : resolve(PROJECT_ROOT, path);
}

const INPUT_PATH = findPath(
  args.find((a) => !a.startsWith("--")) ?? "data/requests.json",
);
const OUT_FOLDER = join(PROJECT_ROOT, "out");
const ONLY_OVERDUE = args.includes("--only-overdue");
const USE_TABLE = args.includes("--table");

// Returns true when the file was read and every request was valid.
function processFile(path: string, summaryPath: string): boolean {
  console.log(`\n===== ${path} =====`);
  try {
    const raw = readRequests(path);
    const { valid, invalid } = validateAll(raw);
    const fullReport = buildReport(valid);
    const report = ONLY_OVERDUE ? onlyOverdue(fullReport) : fullReport;
    const categories = buildCategoryReport(valid);
    if (USE_TABLE) {
      printReportTable(report);
      printInvalid(invalid);
    } else {
      printReport(report, invalid);
    }
    printCategoryReport(categories);
    writeSummary(summaryPath, { report, categories });
    return invalid.length === 0;
  } catch (error) {
    console.log(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
    return false;
  }
}

function main(): void {
  let allOk: boolean;

  if (isFolder(INPUT_PATH)) {
    const files = readdirSync(INPUT_PATH)
      .filter((f) => f.endsWith(".json"))
      .sort();
    // processFile runs for every file (no early stop)
    const results = files.map((f) =>
      processFile(
        join(INPUT_PATH, f),
        join(OUT_FOLDER, `${basename(f, ".json")}-summary.json`),
      ),
    );
    allOk = results.every(Boolean);
  } else {
    allOk = processFile(INPUT_PATH, join(OUT_FOLDER, "summary.json"));
  }

  process.exitCode = allOk ? 0 : 1;
}

function isFolder(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

main();

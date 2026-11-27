import { readRequests } from "./files.ts";
import { validateAll } from "./validation.ts";
import { buildReport, printReport } from "./reports.ts";
import { writeSummary } from "./files.ts";
export {};

function main(): void {
  const raw = readRequests("src/data/requests.json");
  const { validValues, invalidValues } = validateAll(raw);
  const report = buildReport(validValues);
  printReport(report, invalidValues);
  writeSummary("out/summary.json", report);
  process.exitCode = invalidValues.length > 0 ? 1 : 0;
}

main();

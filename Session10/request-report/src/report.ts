import { STATUSES } from './types';
import type { CategoryLine, InvalidEntry, Report, ReportLine, ServiceRequest } from './types';
import { overdueHours, slaHours } from './sla';

function toLine(request: ServiceRequest): ReportLine {
  return { request, slaHours: slaHours(request.priority), overdueHours: overdueHours(request) };
}

// Group by status. Inside each group the most overdue request comes first (sorted by overdueHours).
export function buildReport(valid: readonly ServiceRequest[]): Report {
  const report: Report = { Submitted: [], 'In Review': [], Resolved: [] };
  for (const request of valid) {
    report[request.status].push(toLine(request));
  }
  for (const status of STATUSES) {
    report[status].sort((a, b) => b.overdueHours - a.overdueHours);
  }
  return report;
}

// For --only-overdue: keep only the lines that are past their SLA.
export function onlyOverdue(report: Report): Report {
  return {
    Submitted: report.Submitted.filter((l) => l.overdueHours > 0),
    'In Review': report['In Review'].filter((l) => l.overdueHours > 0),
    Resolved: report.Resolved.filter((l) => l.overdueHours > 0),
  };
}

function formatLine(line: ReportLine): string {
  const { request } = line;
  const overdue = line.overdueHours > 0 ? `OVERDUE by ${line.overdueHours}h` : 'on time';
  return `  #${request.id} ${request.title} [${request.category}, P${request.priority}] ` +
    `open ${request.hoursOpen}h / SLA ${line.slaHours}h - ${overdue}`;
}

export function printReport(report: Report, invalid: readonly InvalidEntry[]): void {
  for (const status of STATUSES) {
    console.log(`\n${status} (${report[status].length})`);
    for (const line of report[status]) {
      console.log(formatLine(line));
    }
  }

  printInvalid(invalid);
}

export function printInvalid(invalid: readonly InvalidEntry[]): void {
  if (invalid.length === 0) return;
  console.log(`\nInvalid items (${invalid.length})`);
  for (const item of invalid) {
    console.log(`  item ${item.index}: ${item.field} - ${item.message}`);
  }
}

// Same report, printed with console.table (for comparing with printReport)
export function printReportTable(report: Report): void {
  for (const status of STATUSES) {
    console.log(`\n${status} (${report[status].length})`);
    console.table(
      report[status].map((l) => ({
        id: l.request.id,
        title: l.request.title,
        category: l.request.category,
        priority: l.request.priority,
        hoursOpen: l.request.hoursOpen,
        sla: l.slaHours,
        overdue: l.overdueHours,
      })),
    );
  }
}

// ---- Second report: requests per category with the average hours open ----

export function buildCategoryReport(valid: readonly ServiceRequest[]): CategoryLine[] {
  const groups = new Map<string, number[]>();
  for (const request of valid) {
    const hours = groups.get(request.category) ?? [];
    hours.push(request.hoursOpen);
    groups.set(request.category, hours);
  }

  const lines: CategoryLine[] = [];
  for (const [category, hours] of groups) {
    const total = hours.reduce((sum, h) => sum + h, 0);
    lines.push({ category, count: hours.length, averageHoursOpen: Math.round((total / hours.length) * 10) / 10 });
  }
  return lines.sort((a, b) => a.category.localeCompare(b.category));
}

export function printCategoryReport(lines: readonly CategoryLine[]): void {
  console.log('\nRequests per category');
  for (const line of lines) {
    console.log(`  ${line.category}: ${line.count} request(s), average ${line.averageHoursOpen}h open`);
  }
}

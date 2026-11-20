import {
  allowedCategories,
  buildSummary,
  calculateSlaDeadline,
  generateTitles,
  hoursUntilDeadline,
  isAllowedCategory,
  isOverdue,
  validateTitle,
} from "./request-utils";
import type { RequestLike } from "./request-utils";

// Types
type RequestStatus = "open" | "overdue" | "resolved on time" | "resolved late";

interface RequestReport {
  request: RequestLike;
  summary: string;
  deadline: Date;
  status: RequestStatus;
  hoursLeft: number;
  titleError: string | undefined;
  categoryValid: boolean;
}

// Data
const NOW: Date = new Date("2026-11-19T12:00:00Z");

const requests: readonly RequestLike[] = [
  {
    id: 1,
    title: "Pothole on Vitosha Boulevard",
    category: "support",
    priority: "high",
    createdAt: new Date("2026-11-18T08:00:00Z"),
  },
  {
    id: 2,
    title: "Login page crashes on submit",
    category: "bug",
    priority: "critical",
    createdAt: new Date("2026-11-19T10:00:00Z"),
  },
  {
    id: 3,
    title: "Add dark mode",
    category: "feature",
    priority: "low",
    createdAt: new Date("2026-11-01T09:30:00Z"),
  },
  {
    id: 4,
    title: "Fix",
    category: "bug",
    priority: "medium",
    createdAt: new Date("2026-11-17T14:00:00Z"),
  },
  {
    id: 5,
    title: "Invoice shows the wrong VAT amount",
    category: "billing",
    priority: "medium",
    createdAt: new Date("2026-11-10T11:00:00Z"),
    resolvedAt: new Date("2026-11-12T09:00:00Z"),
  },
  {
    id: 6,
    title: "Streetlight broken near the central station",
    category: "maintenance",
    priority: "high",
    createdAt: new Date("2026-11-15T07:00:00Z"),
  },
  {
    id: 7,
    title: "Password reset email never arrives",
    category: "support",
    priority: "critical",
    createdAt: new Date("2026-11-18T06:00:00Z"),
    resolvedAt: new Date("2026-11-18T13:00:00Z"),
  },
  {
    id: 8,
    title: "x".repeat(101),
    category: "other",
    priority: "low",
    createdAt: new Date("2026-11-19T09:00:00Z"),
  },
];

// Processing (one function = one responsibility)
function determineStatus(
  request: RequestLike,
  deadline: Date,
  now: Date,
): RequestStatus {
  const late = isOverdue(deadline, now, request.resolvedAt);
  if (request.resolvedAt) {
    return late ? "resolved late" : "resolved on time";
  }
  return late ? "overdue" : "open";
}

function buildReport(request: RequestLike, now: Date): RequestReport {
  const deadline = calculateSlaDeadline(request.createdAt, request.priority);
  return {
    request,
    summary: buildSummary(request),
    deadline,
    status: determineStatus(request, deadline, now),
    hoursLeft: hoursUntilDeadline(deadline, now),
    titleError: validateTitle(request.title).error,
    categoryValid: isAllowedCategory(request.category),
  };
}

function countByStatus(
  reports: readonly RequestReport[],
  status: RequestStatus,
): number {
  return reports.filter((report) => report.status === status).length;
}

// Formatting (pure: returns strings, never prints)
function formatReportLines(report: RequestReport): string[] {
  const lines = [
    report.summary,
    `    status:   ${report.status}`,
    `    deadline: ${report.deadline.toISOString()}`,
  ];
  if (report.status === "open" || report.status === "overdue") {
    lines.push(`    hours left: ${report.hoursLeft}`);
  }
  if (report.titleError !== undefined) {
    lines.push(`    ! invalid title: ${report.titleError}`);
  }
  if (!report.categoryValid) {
    lines.push(
      `    ! invalid category "${report.request.category}" ` +
        `(allowed: ${allowedCategories.join(", ")})`,
    );
  }
  return lines;
}

function formatTotals(reports: readonly RequestReport[]): string[] {
  const invalidCount = reports.filter(
    (report) => report.titleError !== undefined || !report.categoryValid,
  ).length;
  return [
    `Total requests:    ${reports.length}`,
    `Open:              ${countByStatus(reports, "open")}`,
    `Overdue:           ${countByStatus(reports, "overdue")}`,
    `Resolved on time:  ${countByStatus(reports, "resolved on time")}`,
    `Resolved late:     ${countByStatus(reports, "resolved late")}`,
    `With validation problems: ${invalidCount}`,
  ];
}

// Entry point (the only place with side effects)
function main(): void {
  const reports = requests.map((request) => buildReport(request, NOW));

  console.log(`REQUEST REPORT (as of ${NOW.toISOString()})`);
  console.log("=".repeat(60));
  reports.forEach((report) => {
    formatReportLines(report).forEach((line) => console.log(line));
    console.log("");
  });

  console.log("SUMMARY");
  console.log("-".repeat(60));
  formatTotals(reports).forEach((line) => console.log(line));

  console.log("");
  console.log("Sample generated titles (test data):");
  generateTitles(3, "Test request", NOW).forEach((title) =>
    console.log(`  ${title}`),
  );
}

main();

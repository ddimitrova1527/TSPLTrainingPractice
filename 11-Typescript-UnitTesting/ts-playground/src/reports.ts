import type { InvalidEntry, Report, ServiceRequest, ServiceRequestReportLine, Status } from './types';
import { slaHours, isOverdue } from './sla';

const STATUSES: readonly Status[] = ['Submitted', 'In Review', 'Resolved'];

export function buildReport(valid: readonly ServiceRequest[]): Report {
  const report: Report = { Submitted: [], 'In Review': [], Resolved: [] };

  for (let i = 0; i < valid.length; i++) {
    const request = valid[i] as ServiceRequest;
    const line: ServiceRequestReportLine = {
      slaHours: slaHours(request.priority),
      isOverdue: isOverdue(request),
      request,
    };
    report[request.status].push(line);
  }

  for (const status of STATUSES) {
    report[status].sort((a, b) => Number(b.isOverdue) - Number(a.isOverdue));
  }

  return report;
}

export function printReport(report: Report, invalid: readonly InvalidEntry[]): void {
  for (const status of STATUSES) {
    const lines = report[status];
    console.log(`${status} (${lines.length})`);

    for (const { request, slaHours, isOverdue } of lines) {
      const flag = isOverdue ? ' OVERDUE' : '';
      console.log(
        `  #${request.id} P${request.priority} ${request.title} - ${request.hoursOpen}h open / SLA ${slaHours}h${flag}`,
      );
    }
  }

  console.log(`Invalid (${invalid.length})`);
  for (const entry of invalid) {
    console.log(`  [${entry.index}] ${entry.field}: ${entry.message}`);
  }
}

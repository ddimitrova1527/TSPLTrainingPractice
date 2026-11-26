export type Status = 'Submitted' | 'In Review' | 'Resolved';
export const STATUSES: readonly Status[] = ['Submitted', 'In Review', 'Resolved'];

export type ServiceRequest = {
  id: number;
  title: string;
  category: string;
  priority: number;
  status: Status;
  hoursOpen: number;
};

export type InvalidEntry = { index: number; field: string; message: string };
export type ReportLine = { request: ServiceRequest; slaHours: number; overdueHours: number };
export type Report = Record<Status, ReportLine[]>;

export type CategoryLine = { category: string; count: number; averageHoursOpen: number };

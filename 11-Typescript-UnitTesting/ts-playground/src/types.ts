import { isOverdue } from "./sla";

export type Status = 'Submitted' | 'In Review' | 'Resolved';
export type ServiceRequest = {
  id: number; 
  title: string; 
  priority: number;
  status: Status; 
  hoursOpen: number;
};
export type ServiceRequestReportLine = {
  slaHours: number;
  isOverdue: boolean;
  request: ServiceRequest;
}

export type Report = Record<Status, ServiceRequestReportLine[]>;

export type InvalidEntry = {
  index: number;
  field: string;
  message: string;
};

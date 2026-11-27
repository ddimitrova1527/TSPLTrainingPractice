import { ServiceRequest } from "./types";

export function slaHours(priority: number): number {
  if (priority < 1 || priority > 5) throw new Error(`Bad priority: ${priority}`);
  return priority === 1 ? 4 : priority <= 3 ? 24 : 72;
}

export const isOverdue = (r: ServiceRequest): boolean =>
  r.status !== 'Resolved' && r.hoursOpen > slaHours(r.priority);

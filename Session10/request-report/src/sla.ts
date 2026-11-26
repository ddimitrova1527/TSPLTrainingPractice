import type { ServiceRequest } from './types';

const SLA_URGENT_HOURS = 4;
const SLA_NORMAL_HOURS = 24;
const SLA_LOW_HOURS = 72;

const URGENT_PRIORITY = 1;
const NORMAL_MAX_PRIORITY = 3;

export function slaHours(priority: number): number {
  if (priority <= URGENT_PRIORITY) return SLA_URGENT_HOURS;
  if (priority <= NORMAL_MAX_PRIORITY) return SLA_NORMAL_HOURS;
  return SLA_LOW_HOURS;
}

// How many hours past its SLA the request is (0 when on time or resolved)
export function overdueHours(r: ServiceRequest): number {
  if (r.status === 'Resolved') return 0;
  return Math.max(0, r.hoursOpen - slaHours(r.priority));
}

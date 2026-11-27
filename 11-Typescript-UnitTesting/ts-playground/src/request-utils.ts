// Types & constants
export type Priority = "low" | "medium" | "high" | "critical";

export const allowedCategories = [
  "bug",
  "feature",
  "support",
  "billing",
  "other",
] as const;

export type Category = (typeof allowedCategories)[number];

export const titleMinLenght = 5;
export const titleMaxLength = 100;

// SLA window per named priority, in hours.
export const SLA_HOURS: Readonly<Record<Priority, number>> = {
  critical: 4,
  high: 24,
  medium: 72,
  low: 168,
};

export function slaHours(priority: Priority): number;
export function slaHours(priority: number): number;
export function slaHours(priority: Priority | number): number {
  if (typeof priority === "number") {
    if (!Number.isInteger(priority) || priority < 1 || priority > 5) {
      throw new Error("Priority must be 1-5");
    }
    return priority === 1 ? 4 : priority <= 3 ? 24 : 72;
  }
  return SLA_HOURS[priority];
}

export interface RequestLike {
  id: number;
  title: string;
  category: string;
  priority: Priority;
  createdAt: Date;
  resolvedAt?: Date | null;
}

export interface TitleValidationResult {
  valid: boolean;
  error?: string;
}

const msPerHour = 60 * 60 * 1000;

//ID Formatting: formatRequestId(42) -> "REQ-000042"
export function formatId(
  id: number,
  prefix?: string,
  padLength: number = 4,
): string {
  if (!Number.isInteger(id) || id < 0) {
    throw new RangeError(
      `Request id must be a non-negative integer, got ${id}`,
    );
  }
  const paddedId = String(id).padStart(padLength, "0");
  return prefix ? `${prefix}-${paddedId}` : paddedId;
}

/*SLA calculation: returns the SLA deadline for a request created at `createdAt` 
with the given priority*/
export function calculateSlaDeadline(
  createdAt: Date,
  priority: Priority,
  slaHoursByPriority: Readonly<Record<Priority, number>> = SLA_HOURS,
): Date {
  return new Date(
    createdAt.getTime() + slaHoursByPriority[priority] * msPerHour,
  );
}

//Overdue check
/**
 * A request is overdue if it is unresolved and `now` is past its deadline.
 * If it was resolved, it is overdue only if resolved after the deadline.
 */
export function isOverdue(
  deadline: Date,
  now: Date,
  resolvedAt?: Date | null,
): boolean;
export function isOverdue(
  request: { createdAt: Date; priority: number; status: string },
  now: Date,
): boolean;
export function isOverdue(
  deadlineOrRequest:
    | Date
    | { createdAt: Date; priority: number; status: string },
  now: Date,
  resolvedAt?: Date | null,
): boolean {
  if (deadlineOrRequest instanceof Date) {
    const reference = resolvedAt ?? now;
    return reference.getTime() > deadlineOrRequest.getTime();
  }

  if (deadlineOrRequest.status.toLowerCase() === "resolved") {
    return false;
  }

  const deadline = new Date(
    deadlineOrRequest.createdAt.getTime() +
      slaHours(deadlineOrRequest.priority) * msPerHour,
  );
  return now.getTime() > deadline.getTime();
}

//Title validation (5–100 characters)
export function validateTitle(title: string): TitleValidationResult {
  const length = title.trim().length;

  if (length < titleMinLenght) {
    return {
      valid: false,
      error: `Title must be at least ${titleMinLenght} characters (got ${length}).`,
    };
  }
  if (length > titleMaxLength) {
    return {
      valid: false,
      error: `Title must be at most ${titleMaxLength} characters (got ${length}).`,
    };
  }
  return { valid: true };
}

//Category check against an allowed list
export function isAllowedCategory(
  value: string,
  allowed: readonly string[] = allowedCategories,
): value is Category {
  const normalized = value.trim().toLowerCase();
  return allowed.includes(normalized);
}

//Summary text
export function buildSummary(
  request: Pick<RequestLike, "id" | "title" | "category" | "priority">,
  maxTitleLength: number = 60,
): string {
  const title = request.title.trim();
  const shortTitle =
    title.length > maxTitleLength
      ? `${title.slice(0, Math.max(0, maxTitleLength - 1)).trimEnd()}…`
      : title;

  return `${formatId(request.id, "REQ", 6)} [${request.priority.toUpperCase()}] ${shortTitle} (${request.category})`;
}

export class RequestCounter {
  private currentCount = 0;

  get count(): number {
    return this.currentCount;
  }

  increment(): void {
    this.currentCount += 1;
  }
}

// Bonus: time remaining until SLA deadline
/**
 * Hours remaining until the deadline (negative if past due),
 * rounded to one decimal place.
 */
export function hoursUntilDeadline(deadline: Date, now: Date): number {
  const hours = (deadline.getTime() - now.getTime()) / msPerHour;
  return Math.round(hours * 10) / 10;
}

// Stretch: unique test-data titles
export function generateTitles(
  count: number,
  prefix: string,
  now: Date,
): string[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError(`count must be a non-negative integer, got ${count}`);
  }
  const timestamp = now.getTime();
  return Array.from(
    { length: count },
    (_, index) => `${prefix} ${timestamp}-${index + 1}`,
  );
}

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

//SLA window per priority, in hours
export const sLAHours: Readonly<Record<Priority, number>> = {
  critical: 4,
  high: 24,
  medium: 72,
  low: 168,
};

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
export function formatRequestId(
  id: number,
  prefix: string = "REQ",
  padLength: number = 6,
): string {
  if (!Number.isInteger(id) || id < 0) {
    throw new RangeError(
      `Request id must be a non-negative integer, got ${id}`,
    );
  }
  return `${prefix}-${String(id).padStart(padLength, "0")}`;
}

/*SLA calculation: returns the SLA deadline for a request created at `createdAt` 
with the given priority*/
export function calculateSlaDeadline(
  createdAt: Date,
  priority: Priority,
  slaHours: Readonly<Record<Priority, number>> = sLAHours,
): Date {
  return new Date(createdAt.getTime() + slaHours[priority] * msPerHour);
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
): boolean {
  const reference = resolvedAt ?? now;
  return reference.getTime() > deadline.getTime();
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

  return `${formatRequestId(request.id)} [${request.priority.toUpperCase()}] ${shortTitle} (${request.category})`;
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

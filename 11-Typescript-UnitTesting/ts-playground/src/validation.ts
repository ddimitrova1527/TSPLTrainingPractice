import { InvalidEntry, ServiceRequest } from "./types.ts";

export class ValidationError extends Error {
  constructor(
    public readonly field: string,
    message: string,
  ) {
    super(message);
  }
}

export function validatePriority(
  priority: unknown,
): asserts priority is number {
  if (
    typeof priority !== "number" ||
    !Number.isInteger(priority) ||
    priority < 1 ||
    priority > 5
  ) {
    throw new Error("Priority must be 1-5");
  }
}

export function toRequest(value: unknown): ServiceRequest {
  if (typeof value !== "object" || value === null) {
    throw new ValidationError("(root)", "Must be an object");
  }
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "number") {
    throw new ValidationError("id", `${v.id} - Must be a number`);
  }

  if (typeof v.title !== "string" || v.title.length < 5) {
    throw new ValidationError("title", "At least 5 characters");
  }

  if (
    typeof v.priority !== "number" ||
    !Number.isInteger(v.priority) ||
    v.priority < 1 ||
    v.priority > 5
  ) {
    throw new ValidationError("priority", "Priority not in range 1-5");
  }

  if (
    v.status != "Submitted" &&
    v.status != "In Review" &&
    v.status != "Resolved"
  ) {
    throw new ValidationError(
      "status",
      "Status is not within expected values.",
    );
  }

  if (typeof v.hoursOpen !== "number" || v.hoursOpen < 0) {
    throw new ValidationError("hoursOpen", "Cannot have negative hours open.");
  }

  return v as ServiceRequest;
}

export function validateAll(values: unknown[]) {
  const validValues: ServiceRequest[] = [];
  const invalidValues: InvalidEntry[] = [];

  for (let i = 0; i < values.length; i++) {
    try {
      validValues.push(toRequest(values[i]));
    } catch (e) {
      const field = e instanceof ValidationError ? e.field : "unknown";
      const message = e instanceof Error ? e.message : String(e);
      invalidValues.push({ index: i, field, message });
    }
  }

  return { validValues, invalidValues };
}

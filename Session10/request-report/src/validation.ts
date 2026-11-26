import { STATUSES } from './types';
import type { InvalidEntry, ServiceRequest } from './types';

const MIN_TITLE_LENGTH = 5;
const MIN_PRIORITY = 1;
const MAX_PRIORITY = 5;

// One rule per field: the field name, a message and a check.
type Rule = { field: keyof ServiceRequest; message: string; ok: (v: unknown) => boolean };

const RULES: readonly Rule[] = [
  { field: 'id', message: 'id must be an integer', ok: (v) => Number.isInteger(v) },
  {
    field: 'title',
    message: `title must be text with at least ${MIN_TITLE_LENGTH} characters`,
    ok: (v) => typeof v === 'string' && v.trim().length >= MIN_TITLE_LENGTH,
  },
  {
    field: 'category',
    message: 'category must be non-empty text',
    ok: (v) => typeof v === 'string' && v.trim().length > 0,
  },
  {
    field: 'priority',
    message: `priority must be an integer ${MIN_PRIORITY}-${MAX_PRIORITY}`,
    ok: (v) => Number.isInteger(v) && (v as number) >= MIN_PRIORITY && (v as number) <= MAX_PRIORITY,
  },
  {
    field: 'status',
    message: `status must be one of: ${STATUSES.join(', ')}`,
    ok: (v) => STATUSES.some((s) => s === v),
  },
  {
    field: 'hoursOpen',
    message: 'hoursOpen must be a number, 0 or more',
    ok: (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0,
  },
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// The type guard: after `if (isServiceRequest(x))` TypeScript knows x is a ServiceRequest.
export function isServiceRequest(value: unknown): value is ServiceRequest {
  return isObject(value) && RULES.every((rule) => rule.ok(value[rule.field]));
}

// Used only for invalid items: which field is wrong first?
function findProblem(value: unknown, index: number): InvalidEntry {
  if (!isObject(value)) {
    return { index, field: '(item)', message: 'item must be an object' };
  }
  const broken = RULES.find((rule) => !rule.ok(value[rule.field]));
  return { index, field: broken?.field ?? '(item)', message: broken?.message ?? 'invalid item' };
}

export function validateAll(raw: readonly unknown[]): { valid: ServiceRequest[]; invalid: InvalidEntry[] } {
  const valid: ServiceRequest[] = [];
  const invalid: InvalidEntry[] = [];

  raw.forEach((item, index) => {
    if (isServiceRequest(item)) {
      valid.push(item);
    } else {
      invalid.push(findProblem(item, index));
    }
  });

  return { valid, invalid };
}

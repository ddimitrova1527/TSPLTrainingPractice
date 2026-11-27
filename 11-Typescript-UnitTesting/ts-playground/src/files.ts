import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

export function readRequests(path: string): unknown[] {
  const parsed: unknown = JSON.parse(readFileSync(path, 'utf-8'));
  if (!Array.isArray(parsed)) throw new Error(`${path} must contain an array`);
  return parsed;
}

export function writeSummary(path: string, summary: object): void {
  mkdirSync('out', { recursive: true });
  writeFileSync(path, JSON.stringify(summary, null, 2));
}

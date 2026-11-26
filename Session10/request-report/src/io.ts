import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const JSON_INDENT = 2;

export function readRequests(path: string): unknown[] {
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch (error) {
    // Show the real reason (missing file, folder, no permission) and where we looked.
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot read file "${path}" (working folder: ${process.cwd()}). ${reason}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`File "${path}" is not valid JSON.`);
  }

  if (!Array.isArray(data)) {
    throw new Error(`File "${path}" must contain a JSON array.`);
  }
  return data;
}

export function writeSummary(path: string, summary: object): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(summary, null, JSON_INDENT));
}

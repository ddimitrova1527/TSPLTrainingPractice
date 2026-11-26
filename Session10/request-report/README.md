# request-report · Session 10 starter

Build the **Request Queue Report** step by step.

## Setup

```bash
npm install
npx tsc --noEmit                      # must pass: strict mode
npx tsx src/main.ts                   # runs data/requests.json
npx tsx src/main.ts data/broken.json  # wrong types and missing fields
npx tsx src/main.ts data/malformed.json  # not valid JSON
```

## What is here

| File | Status |
|---|---|
| `src/types.ts` | Done: `Status`, `ServiceRequest`, `InvalidEntry`, `ReportLine`, `Report` |
| `src/main.ts` | Done: the steps from the slides |
| `src/io.ts` | TODO: `readRequests`, `writeSummary` |
| `src/validation.ts` | TODO: `toRequest`, `validateAll` (`ValidationError` is given) |
| `src/sla.ts` | TODO: `slaHours`, `overdueHours` |
| `src/report.ts` | TODO: `buildReport`, `printReport` |
| `data/` | `requests.json` (valid), `broken.json` (6 bad items), `malformed.json` (broken JSON) |

## Tasks

1. Implement `readRequests`, `validateAll`, `buildReport`, `printReport` and `writeSummary` in this order. **Commit after each one.**
2. The program must exit with code `1` when any request is invalid.
3. Run against all three data files. Every run must print a sensible message, **never a stack trace**.
4. Open a pull request and review a teammate's solution.

## Definition of Done

| Check | How |
|---|---|
| Compiles in strict mode | `npx tsc --noEmit` |
| Runs end to end | `npx tsx src/main.ts` |
| Handles bad input | `data/broken.json`, `data/malformed.json` |
| Readable | Small named functions, no magic numbers |
| Reviewed | Pull request reviewed by a teammate |

## Stretch

1. Accept the input path and a `--only-overdue` flag from `process.argv`
2. Sort the report by how many hours overdue each request is
3. Replace the hand-written validation with a type guard `isServiceRequest(value): value is ServiceRequest`
4. Print the report as a table with `console.table` and compare with your own formatting

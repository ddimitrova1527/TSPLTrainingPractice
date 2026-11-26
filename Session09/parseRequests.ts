// parseRequests.ts · S09 Error Handling and Debugging · Homework
//
// Run:   npx tsx parseRequests.ts   (in the JavaScript Debug Terminal to debug)
//        Run it from the folder that contains requests.json.
//
// Reads requests.json (10 requests, 3 of them broken), validates every request
// and prints which ones are invalid and why.
//
// Custom error classes:
//   - InputFileError   the file cannot be read, is not valid JSON, or is not an array
//   - ValidationError  one request has a wrong value
//
// Expected output:
//
//   Read 10 requests: 7 valid, 3 invalid
//
//   Invalid requests:
//     REQ-1023: priority must be between 1 and 5, got 9
//     REQ-1042: status must be one of Submitted, In Review, Waiting for Info, Resolved, got "Closed"
//     REQ-1061: hoursOpen must be a number of 0 or more, got "2"

export {};

type Status = "Submitted" | "In Review" | "Waiting for Info" | "Resolved";

type ServiceRequest = {
  id: number;
  title: string;
  category: string;
  priority: number;
  status: Status;
  hoursOpen: number;
};

const STATUSES: Status[] = [
  "Submitted",
  "In Review",
  "Waiting for Info",
  "Resolved",
];
const MIN_PRIORITY = 1;
const MAX_PRIORITY = 5;
const ID_DIGITS = 4;
const DATA_FILE = "requests.json";

class InputFileError extends Error {
  name = "InputFileError";
}

class ValidationError extends Error {
  name = "ValidationError";
}

function formatRequestId(id: number): string {
  return `REQ-${String(id).padStart(ID_DIGITS, "0")}`;
}

function parseText(text: string): Record<string, unknown>[] {
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data)) {
      throw new InputFileError(`${DATA_FILE} must contain an array`);
    }
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(`Invalid JSON: ${error.message}.
                Call Stack: ${error.stack}
                Cause: ${error.cause}`);
      throw new InputFileError(`${DATA_FILE} is not valid JSON`, {
        cause: error,
      });
    } else {
      throw error; // not ours: rethrow
    }
  } finally {
    console.log("Parsing finished");
  }
}

function validateRequest(
  raw: Record<string, unknown>,
  index: number,
): ServiceRequest {
  const label =
    typeof raw.id === "number" ? formatRequestId(raw.id) : `#${index + 1}`;

  if (typeof raw.id !== "number") {
    throw new ValidationError(
      `${label}: id must be a number, got ${JSON.stringify(raw.id)}`,
    );
  }
  if (typeof raw.title !== "string" || raw.title === "") {
    throw new ValidationError(`${label}: title must be a non-empty text`);
  }
  if (typeof raw.category !== "string" || raw.category === "") {
    throw new ValidationError(`${label}: category must be a non-empty text`);
  }
  if (
    typeof raw.priority !== "number" ||
    raw.priority < MIN_PRIORITY ||
    raw.priority > MAX_PRIORITY
  ) {
    throw new ValidationError(
      `${label}: priority must be between ${MIN_PRIORITY} and ${MAX_PRIORITY}, got ${JSON.stringify(raw.priority)}`,
    );
  }
  if (!STATUSES.includes(raw.status as Status)) {
    throw new ValidationError(
      `${label}: status must be one of ${STATUSES.join(", ")}, got ${JSON.stringify(raw.status)}`,
    );
  }
  if (typeof raw.hoursOpen !== "number" || raw.hoursOpen < 0) {
    throw new ValidationError(
      `${label}: hoursOpen must be a number of 0 or more, got ${JSON.stringify(raw.hoursOpen)}`,
    );
  }
  return raw as ServiceRequest;
}

function main(): void {
  // 1. Read the file
  let rawRequests: Record<string, unknown>[];
  try {
    rawRequests = loadRequests();
  } catch (error) {
    if (error instanceof InputFileError) {
      console.error(`${error.name}: ${error.message}`);
      return;
    }
    throw error;
  }

  // 2. Validate every request
  const valid: ServiceRequest[] = [];
  const problems: string[] = [];

  for (let i = 0; i < rawRequests.length; i++) {
    try {
      valid.push(validateRequest(rawRequests[i]!, i));
    } catch (error) {
      if (error instanceof ValidationError) {
        problems.push(error.message);
      } else {
        throw error;
      }
    }
  }

  // 3. Print the result
  console.log(
    `Read ${rawRequests.length} requests: ${valid.length} valid, ${problems.length} invalid`,
  );
  console.log("");
  console.log("Invalid requests:");
  for (const problem of problems) {
    console.log(`  ${problem}`);
  }
}

main();
function loadRequests(): Record<string, unknown>[] {
  throw new Error("Function not implemented.");
}

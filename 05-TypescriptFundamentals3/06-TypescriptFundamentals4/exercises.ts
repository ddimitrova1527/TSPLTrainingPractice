//Write a function-free script that takes a priority (1–5) and prints
// the SLA in hours using if / else if, then rewrite it with switch

let priority: 1 | 2 | 3 | 4 | 5 = 4;

if (priority >= 4) {
  console.log("SLA is 4 days");
} else if (priority >= 2) {
  console.log("SLA is 7 days");
} else {
  console.log("SLA is when the time comes - if it ever comes.");
}

switch (Number(priority)) {
  case 1:
    console.log("SLA is when the time comes - if it ever comes.");
    break;
  case 2:
  case 3:
    console.log("SLA is 7 days");
    break;
  case 4:
  case 5:
    console.log("SLA is 4 days");
    break;
  default:
    console.log("unknown value");
}

// Print the numbers 1 to 100;
// for multiples of 3 print Clerk
// of 5 Citizen
// of both Supervisor

for (let i: number = 1; i <= 100; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log("Supervisor");
  } else if (i % 3 === 0) {
    console.log("Clerk");
  } else if (i % 5 === 0) {
    console.log("Citizen");
  } else {
    console.log(i);
  }
}

//Given an array of request statuses, count how many are Submitted, In Review and Resolved
let statuses: string[] = [
  "Submitted",
  "In Review",
  "Resolved",
  "Submitted",
  "In Review",
  "Resolved",
  "Submitted",
  "In Review",
  "Resolved",
  "Submitted",
  "In Review",
  "Resolved",
];

let countSubmitted: number = 0;
let countInReview: number = 0;
let countResolved: number = 0;

for (let stat of statuses) {
  if (stat === "Submitted") {
    countSubmitted++;
  }
  if (stat === "In Review") {
    countInReview++;
  }
  if (stat === "Resolved") {
    countResolved++;
  }
}

console.log(
  `Submitted: ${countSubmitted}, In Review: ${countInReview}, Resolved: ${countResolved}`,
);
//Print every combination of 3 roles and 4 pages as role → page
const roles = ["Citizen", "Clerk", "Supervisor"];
const pages = ["/requests", "/inbox", "/reports", "/profile"];

for (const role of roles) {
  for (const page of pages) {
    console.log(`${role} opens ${page}`);
  }
}

//Model status as a union of literal types and make the switch exhaustive: adding a new status must cause a compile error (hint: never)
type RequestStatus = "Submitted" | "In Review" | "Resolved";

function printSLA(status: RequestStatus) {
  switch (status) {
    case "Submitted":
      console.log("SLA is 7 days");
      break;
    case "In Review":
      console.log("SLA is 7 days");
      break;
    case "Resolved":
      console.log("SLA is 4 days");
      break;
    default:
      const _exhaustiveCheck: never = status;
      throw new Error(`Unhandled status: ${_exhaustiveCheck}`);
  }
}

//Find the first request with priority 1 that is not resolved, using break
let requests = [
  { id: "A", priority: 1, status: "Resolved" },
  { id: "B", priority: 1, status: "Submitted" },
  { id: "C", priority: 1, status: "In Review" },
  { id: "D", priority: 1, status: "Resolved" },
];

for (const req of requests) {
  if (req.priority === 1 && req.status !== "Resolved") {
    console.log(`First critical request found: ${req.id}`);
    break;
  }
}

//Explain in a comment why for (const i in ['a', 'b']) prints 0 and 1 as strings
for (const i in ["a", "b"]) {
  console.log(i);
}

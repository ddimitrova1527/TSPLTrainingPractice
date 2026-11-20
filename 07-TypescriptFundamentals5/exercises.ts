//Create request-utils.ts with at least 6 small, pure, typed functions: id formatting, SLA calculation, overdue check, title validation (5–100 characters), category check against an allowed list, summary text

//Use them from a separate main.ts to process an array of 8 hard-coded requests and print a report

//No any, no var, no ==. npx tsc --noEmit must pass

//Pull request; your reviewer checks names and single responsibility

//Stretch: write a generateTitles(count, prefix) that returns unique titles with a timestamp suffix, for test data

const statuses: string[] = ["Submitted", "In Review", "Resolved"];
statuses[5];
console.log(statuses[5]); // This will log 'undefined' since index 5 is out of bounds

console.log([10, 9, 100, 1].sort());

const original = ["Citizen", "Clerk"];
const sameArray = original;
sameArray.push("Admin");
console.log(original);

function formatRequest(
  id: number,
  title: string,
  prefix = "REQ",
  note?: string,
): string {
  const base = `${prefix}-${id}: ${title}`;
  return note ? `${base} (${note})` : base;
}
formatRequest(7, "Pothole", "INC");
console.log(formatRequest);

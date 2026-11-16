const roles = ["Citizen", "Clerk", "Supervisor"];
const pages = ["/requests", "/inbox", "/reports", "/profile"];
for (const role of roles) {
  for (const page of pages) console.log(`${role} opens ${page}`);
}

for (let i = 10; i > 0; i -= 2) {
  console.log(i);
}

//statuses/priorities A: Resolved/1, B: Submitted/3, C: Submitted/1, D: In Review/1, what is printed?

let array = [
  { id: "A", status: "Resolved", priority: 1 },
  { id: "B", status: "Submitted", priority: 3 },
  { id: "C", status: "Submitted", priority: 1 },
  { id: "D", status: "In Review", priority: 1 },
];
for (const r of array) {
  if (r.status === "Resolved") continue;
  if (r.priority === 1) {
    console.log(`First critical: ${r.id}`);
    break;
  }
}

let assignee: string = "John Doe";
function describe(assignee: string | null): string {
  if (assignee === null) {
    return "Unassigned";
  }
  return assignee.toUpperCase();
}
console.log(describe(assignee));

const fruits = ["apple", "banana", "cherry"];

for (const fruit of fruits) {
  console.log(fruit);
}

const colors = ["red", "green", "blue"];

for (const [index, color] of colors.entries()) {
  console.log(index, color);
}

for (let i = 1; i <= 5; i++) {
  console.log(`Creating request ${i} of 5`);
}

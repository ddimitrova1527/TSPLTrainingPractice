// 1.  Write a request status validator: given the current and the next status, print whether the transition is allowed (Submitted → In Review → Resolved; In Review → Waiting for Info → In Review)
// Read the current and next status from the console input.
import * as readline from "node:readline/promises";

async function main(): Promise<void> {
  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let currentStatus = await input.question("Enter the current status: ");
  let nextStatus: string | null = await input.question(
    "Enter the next status: ",
  );

  console.log(`Transition: ${currentStatus} -> ${nextStatus}`);

  input.close();
  //The following commented section give the chanse to work with hardcoded values for testing purposes. Uncomment to use them instead of console input. The first section should be commented.
  // const currentStatus = "Submitted";
  // const nextStatus = "In Review";
  // console.log(`Transition: ${currentStatus} -> ${nextStatus}`);

  if (!nextStatus) {
    nextStatus = null;
  }
  //Define a boolean variable to store whether the transition is allowed or not
  let isAllowed: boolean = false;

  // Use a switch statement to check the current status and determine if the transition to the next status is allowed
  switch (currentStatus) {
    case "Submitted":
      isAllowed = nextStatus === "In Review";
      break;
    case "In Review":
      isAllowed =
        nextStatus === "Resolved" ||
        nextStatus === "Waiting for Info" ||
        nextStatus === null;
      break;
    case "Waiting for Info":
      isAllowed = nextStatus === "In Review";
      break;

    default:
      console.log("Invalid status transition.");
      isAllowed = false;
  }
  // Print the result of the transition check
  console.log(isAllowed ? "Allowed" : "Not Allowed");
}
main();

//2. Generate test data: 10 request titles "Test request 01" … "Test request 10" with priorities cycling 1–5
// Using loop to generate the titles and priorities, and print them to the console.

// Initialize the priority variable to 1 before the loop starts.
let priority = 1;

for (let i = 1; i <= 10; i++) {
  console.log(`Title: Test request ${i}. Priority: ${priority}`);

  priority++; // Increment the priority variable by 1 after each iteration of the loop.

  if (priority > 5) {
    // Check if the priority variable exceeds 5, and if so, reset it to 1 to cycle through the priorities.
    priority = 1;
  }
}

// 3.  Print a text table of requests: id, title padded to 25 characters, priority, status
let id: number = 1000;
let title: string = "Technical request";
let padedTitle: string = title.padEnd(25, " ");
let priority1: number = 1;
let status: string = "Submitted";

for (let i = 1; i <= 10; i++) {
  padedTitle = padedTitle + id;

  console.log(`${id} ${padedTitle} ${priority1} ${status}`);
  id++;
  switch (status) {
    case "Submitted":
      priority = 1;
    case "In Review":
      priority = 2;
    case "Waiting for Info":
      priority = 3;
    case "Resolved":
      priority = 4;
    default:
      priority = 5;
  }
}

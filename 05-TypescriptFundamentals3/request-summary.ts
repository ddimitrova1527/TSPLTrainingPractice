// declare a request with all its fields and print a formatted summary card in the terminal
const request = {
  id: 12345,
  title: "Unable to access the application",
  description:
    "User is unable to log in to the application and receives an error message.",
  status: "Open",
  priority: "High",
  assignedTo: "John Doe",
  createdAt: new Date("2023-10-01"),
  updatedAt: new Date("2023-10-05"),
};

console.log("Request Summary Card:");
console.log(`ID: ${request.id}`);
console.log(`Title: ${request.title}`);
console.log(`Description: ${request.description}`);
console.log(`Status: ${request.status}`);
console.log(`Priority: ${request.priority}`);
console.log(`Assigned To: ${request.assignedTo}`);
console.log(`Created At: ${request.createdAt.toLocaleDateString()}`);
console.log(`Updated At: ${request.updatedAt.toLocaleDateString()}`);

//Calculate an SLA: given a created hour and the priority (P1 = 4 h, P2 = 24 h, P3 = 72 h), print the hour the request is due
const slaHours =
  request.priority === "P1" ? 4 : request.priority === "P2" ? 24 : 72;
console.log(`SLA Hours: ${slaHours}`);

//Validate an email string without regular expressions: contains one @, has text before and after it, ends with a domain
const email = "user@example.com";
const hasAtSymbol = email.includes("@");
const hasTextBeforeAt = email.substring(0, email.indexOf("@")).length > 0;
const hasTextAfterAt = email.substring(email.indexOf("@") + 1).length > 0;
const endsWithDomain =
  email.endsWith(".com") || email.endsWith(".org") || email.endsWith(".net");
console.log(
  `Email is valid: ${hasAtSymbol && hasTextBeforeAt && hasTextAfterAt && endsWithDomain}`,
);

//Stretch: do the email check with a regular expression too and compare readability
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(`Email is valid (with regex): ${emailRegex.test(email)}`);

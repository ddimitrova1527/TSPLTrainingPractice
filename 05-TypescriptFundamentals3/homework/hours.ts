//convert 30 SLA hours into full days and remaining hours (use Math.floor and %) and into minutes. Then start a let counter at 5 open requests, add 3 new ones, resolve 2 and print the result

const slaHours: number = 30;
const fullDays: number = Math.floor(slaHours / 8);
const remainingHours: number = slaHours % 8;
const totalMinutes: number = slaHours * 60;

let openRequests: number = 5;
openRequests += 3;
openRequests -= 2;

console.log(`Full Days: ${fullDays}`);
console.log(`Remaining Hours: ${remainingHours}`);
console.log(`Total Minutes: ${totalMinutes}`);
console.log(`Open Requests: ${openRequests}`);

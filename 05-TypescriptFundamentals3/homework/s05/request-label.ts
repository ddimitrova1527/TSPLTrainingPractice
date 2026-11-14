//build the label REQ-1042 [P2] Broken street light (Lighting) from separate constants, print it, then print its length with .length
const requestId: string = "REQ-1042";
const priority: string = "[P2]";
const description: string = "Broken street light";
const category: string = "(Lighting)";

const label: string = `${requestId} ${priority} ${description} ${category}`;
console.log(label);
console.log(`Label Length: ${label.length}`);

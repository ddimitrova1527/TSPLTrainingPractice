// start from '   broken STREET light   ' and print it trimmed, in lower case, in upper case, capitalized (Broken street light), whether it mentions "light", and with "street" replaced by "road"
const title: string = "   broken STREET light   ";
//print it trimmed
console.log(title.trim());
//print it in lower case
console.log(title.toLowerCase());
//print it in upper case
console.log(title.toUpperCase());
//print it capitalized (Broken street light)
const capitalizedTitle: string = title
  .trim()
  .toLowerCase()
  .replace(/\b\w/g, (char) => char.toUpperCase());
console.log(capitalizedTitle);
//print whether it mentions "light"
console.log(title.includes("light"));
//print with "street" replaced by "road"
console.log(title.replace("street", "road"));

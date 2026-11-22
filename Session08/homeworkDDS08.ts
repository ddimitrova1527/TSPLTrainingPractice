//Model the New Request wizard data as types: ContactDetails, Location, RequestDetails, Attachment,
type ContactDetails = {
  fullName: string;
  preferedContactMethod: string;
  email: string;
  phone?: string;
};

type Location = {
  address: string;
  city: string;
  postalCode: number;
  locationDescription: string;
  gpsCoordinates: number;
};

type RequestDetails = {
  title: string;
  category: string;
  priority: string;
  isEmergency: boolean;
  description: string;
};

type Attachment = {
  fileName: string;
  sizeBytes: number;
  fileType: string;
};

//Create new request that combines all wizard types
type NewRequest = {
  contactDetails: ContactDetails;
  location: Location;
  details: RequestDetails;
  attachments: Attachment[];
};

//Create 3 valid test data objects
const firstValidTestData: NewRequest = {
  contactDetails: {
    fullName: "Maria Ivanova",
    preferedContactMethod: "email",
    email: "maria@example.com",
    phone: "+359888123456",
  },
  location: {
    address: "1 Vitosha Blvd",
    city: "Sofia",
    postalCode: 1000,
    locationDescription: "Bulgaria",
    gpsCoordinates: 15616546874987,
  },
  details: {
    title: "Pothole",
    category: "Roads",
    priority: "High",
    isEmergency: true,
    description: "Pothole near the crossing",
  },
  attachments: [
    { fileName: "pothole.jpg", fileType: "image/jpeg", sizeBytes: 482_113 },
  ],
};

// Valid: optional fields (phone, postcode) omitted and no attachments
const secondValidTestData: NewRequest = {
  contactDetails: {
    fullName: "Georgi Petrov",
    email: "georgi@example.com",
    preferedContactMethod: "email",
    phone: "+359888123456",
  },
  location: {
    address: "12 Graf Ignatiev St",
    city: "Sofia",
    postalCode: 1500,
    locationDescription: "Bulgaria",
    gpsCoordinates: 15616546874987,
  },
  details: {
    category: "Lighting",
    title: "Street lamp out",
    description: "The lamp has not worked for a week.",
    priority: "Low",
    isEmergency: false,
  },
  attachments: [],
};

// Valid: several attachments
const thirdValidTestData: NewRequest = {
  contactDetails: {
    fullName: "Elena Dimitrova",
    email: "elena@example.com",
    phone: "+359877654321",
    preferedContactMethod: "email",
  },
  location: {
    address: "5 Tsar Osvoboditel Blvd",
    city: "Sofia",
    postalCode: 1000,
    locationDescription: "Bulgaria",
    gpsCoordinates: 15616585465487,
  },
  details: {
    category: "Waste",
    title: "Overflowing bins",
    description: "Bins have not been collected for several days.",
    priority: "Medium",
    isEmergency: false,
  },
  attachments: [
    { fileName: "bins-front.png", fileType: "image/png", sizeBytes: 120_400 },
    { fileName: "bins-side.png", fileType: "image/png", sizeBytes: 98_760 },
    { fileName: "report.pdf", fileType: "application/pdf", sizeBytes: 15_200 },
  ],
};

console.log("=== VALID TEST DATA ===");
console.log("firstTestData:", firstValidTestData);
console.log("secondTestData:", secondValidTestData);
console.log("thirdTestData:", thirdValidTestData);

//Create 3 valid test data objects (missing or wrong fields)
// Invalid: email is missing (required field)
const firstInvalidMissingEmail: unknown = {
  contact: { fullName: "No Email" },
  location: { street: "1 Vitosha Blvd", city: "Sofia" },
  details: {
    category: "Roads",
    title: "Test",
    description: "Test",
    priority: "Low",
  },
  attachments: [],
};

// Invalid: category Potholes
const secondInvalidCategory: unknown = {
  contact: { fullName: "Bad Category", email: "bad@example.com" },
  location: { street: "1 Vitosha Blvd", city: "Sofia" },
  details: {
    category: "Potholes",
    title: "Test",
    description: "Test",
    priority: "Low",
  },
  attachments: [],
};

// Invalid: attachment sizeBytes is a string, and the whole location step is missing
const thirdInvalidTypes: unknown = {
  contact: { fullName: "Wrong Types", email: "wrong@example.com" },
  details: {
    category: "Other",
    title: "Test",
    description: "Test",
    priority: "Medium",
  },
  attachments: [
    { fileName: "photo.jpg", mimeType: "image/jpeg", sizeBytes: "482113" },
  ],
};

console.log("=== INVALID TEST DATA ===");
console.log("firstInvalidMissingEmail:", firstInvalidMissingEmail);
console.log("secondInvalidCategory:", secondInvalidCategory);
console.log("thirdInvalidTypes:", thirdInvalidTypes);

//Write a TestDataFactory class with a method validRequest(overrides?) that returns a fresh object each time,
//using spread for the overrides
type Request = {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
};

class TestDataFactory {
  validRequest(overrides?: Partial<Request>): Request {
    return {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      isActive: true,
      ...overrides,
    };
  }
}

// Usage
const factory = new TestDataFactory();

const a = factory.validRequest();
const b = factory.validRequest({ name: "Jane", age: 25 });

//Stretch: add a uniqueTitle() method that never returns the same title twice in a run
class TestDataFact {
  private counter = 0;

  uniqueTitle(): string {
    this.counter++;
    return `Title ${this.counter}`;
  }
}

// Usage
const fact = new TestDataFact();

console.log(fact.uniqueTitle()); // "Title 1"
console.log(fact.uniqueTitle()); // "Title 2"
console.log(fact.uniqueTitle()); // "Title 3"

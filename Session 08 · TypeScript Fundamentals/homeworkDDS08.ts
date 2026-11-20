//_Model the New Request wizard data as types: ContactDetails, Location, RequestDetails, Attachment,
//and one NewRequest that combines them

type ContactDetails = {
  fullName: string;
  preferedContactMethod: string;
  email: string;
  phone?: string;
};

type Location = {
  address: string;
  city: string;
  postalCode: string;
  locationDescription: string;
  gpsCoordinates: number;
};

type RequestDetails = {
  title: string;
  category: string;
  priority: string;
  isEmergency: boolean;
};

type Attachment = {
  fileName: string;
  sizeBytes: number;
  fileType: string;
};
//Create new request that combines all wizard syteps
type NewRequest = {
  contact: ContactDetails;
  location: Location;
  details: RequestDetails;
  attachments: Attachment[];
};

//Create 3 valid test data objects and 3 invalid ones (missing or wrong fields), with a comment why each is invalid
const firstTestData: NewRequest = {
  contact: {
    fullName: "Maria Ivanova",
    preferedContactMethod: "email",
    email: "maria@example.com",
    phone: "+359888123456",
  },
  location: {
    address: "1 Vitosha Blvd",
    city: "Sofia",
    postalCode: "1000",
    locationDescription: "Bulgaria",
    gpsCoordinates: 15616546874987,
  },
  details: {
    title: "Pothole near the crossing",
    category: "Roads",
    priority: "High",
    isEmergency: true,
  },
  attachments: [
    { fileName: "pothole.jpg", fileType: "image/jpeg", sizeBytes: 482_113 },
  ],
};

// Valid: optional fields (phone, postcode) omitted and no attachments
const validMinimal: NewRequest = {
  contact2: { fullName: "Georgi Petrov", email: "georgi@example.com" },
  location: { street: "12 Graf Ignatiev St", city: "Sofia" },
  details: {
    category: "Lighting",
    title: "Street lamp out",
    description: "The lamp has not worked for a week.",
    priority: "Low",
  },
  attachments: [],
};

// Valid: several attachments
export const validMultiAttachment: NewRequest = {
  contact3: {
    fullName: "Elena Dimitrova",
    email: "elena@example.com",
    phone: "+359877654321",
  },
  location: {
    street: "5 Tsar Osvoboditel Blvd",
    city: "Sofia",
    postcode: "1000",
  },
  details: {
    category: "Waste",
    title: "Overflowing bins",
    description: "Bins have not been collected for several days.",
    priority: "Medium",
  },
  attachments: [
    { fileName: "bins-front.png", fileType: "image/png", sizeBytes: 120_400 },
    { fileName: "bins-side.png", fileType: "image/png", sizeBytes: 98_760 },
    { fileName: "report.pdf", fileType: "application/pdf", sizeBytes: 15_200 },
  ],
};

// ---------- Invalid test data ----------
// Typed as `unknown` so the file still compiles: these are meant to be
// rejected by validation, not by the type checker.

// Invalid: contact.email is missing (required field)
const invalidMissingEmail: unknown = {
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

// Invalid: category 'Potholes' is not one of 'Roads' | 'Lighting' | 'Waste' | 'Other'
const invalidCategory: unknown = {
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
const invalidWrongTypes: unknown = {
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

//Write a TestDataFactory class with a method validRequest(overrides?) that returns a fresh object each time,
//using spread for the overrides

//Stretch: add a uniqueTitle() method that never returns the same title twice in a run

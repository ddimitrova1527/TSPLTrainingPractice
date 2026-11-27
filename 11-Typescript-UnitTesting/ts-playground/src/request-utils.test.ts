import { describe, test, expect, beforeEach } from "vitest";
import { slaHours, isOverdue, formatId, RequestCounter } from "./request-utils";

// ---------------------------------------------------------------------------
// slaHours
// ---------------------------------------------------------------------------
describe("slaHours", () => {
  // Data-driven test #1: valid priorities
  test.each([
    { priority: 1, expected: 4 },
    { priority: 2, expected: 24 },
    { priority: 5, expected: 72 },
  ])(
    "priority $priority has an SLA of $expected hours",
    ({ priority, expected }) => {
      // Arrange: the priority comes from the table

      // Act
      const result = slaHours(priority);

      // Assert
      expect(result).toBe(expected);
    },
  );

  // Data-driven test #2 (error): invalid priorities
  test.each([
    { priority: 0, reason: "just below the lower boundary" },
    { priority: 6, reason: "just above the upper boundary" },
    { priority: -1, reason: "a negative number" },
    { priority: 2.5, reason: "a non-integer" },
  ])("throws for priority $priority because it is $reason", ({ priority }) => {
    // Arrange: the invalid priority comes from the table

    // Act
    const act = () => slaHours(priority);

    // Assert
    expect(act).toThrow("Priority must be 1-5");
  });

  // Error test #1
  test('throws "Priority must be 1-5" when priority is 0', () => {
    // Arrange
    const priority = 0;

    // Act
    const act = () => slaHours(priority);

    // Assert
    expect(act).toThrow("Priority must be 1-5");
  });

  // Error test #2
  test("throws an Error instance when priority is 6", () => {
    // Arrange
    const priority = 6;

    // Act
    const act = () => slaHours(priority);

    // Assert
    expect(act).toThrow(Error);
  });
});

// ---------------------------------------------------------------------------
// formatId
// ---------------------------------------------------------------------------
describe("formatId", () => {
  test.each([
    { id: 1, expected: "0001" },
    { id: 42, expected: "0042" },
    { id: 999, expected: "0999" },
    { id: 1234, expected: "1234" },
  ])('pads id $id to "$expected"', ({ id, expected }) => {
    // Arrange: the id comes from the table

    // Act
    const result = formatId(id);

    // Assert
    expect(result).toBe(expected);
  });

  test("leaves ids with more than four digits unchanged", () => {
    // Arrange
    const id = 12345;

    // Act
    const result = formatId(id);

    // Assert
    expect(result).toBe("12345");
  });
});

// ---------------------------------------------------------------------------
// isOverdue
// ---------------------------------------------------------------------------
describe("isOverdue", () => {
  const createdAt = new Date("2026-01-01T08:00:00Z");
  const hoursAfter = (h: number) =>
    new Date(createdAt.getTime() + h * 3_600_000);

  test("returns false for resolved requests, even long past the SLA", () => {
    // Arrange
    const request = { id: 1, priority: 1, createdAt, status: "resolved" };
    const now = hoursAfter(1000);

    // Act
    const result = isOverdue(request, now);

    // Assert
    expect(result).toBe(false);
  });

  test("returns true for an open request past its SLA", () => {
    // Arrange: priority 1 has a 4 hour SLA
    const request = { id: 2, priority: 1, createdAt, status: "open" };
    const now = hoursAfter(5);

    // Act
    const result = isOverdue(request, now);

    // Assert
    expect(result).toBe(true);
  });

  test("returns false for an open request still within its SLA", () => {
    // Arrange
    const request = { id: 3, priority: 1, createdAt, status: "open" };
    const now = hoursAfter(3);

    // Act
    const result = isOverdue(request, now);

    // Assert
    expect(result).toBe(false);
  });

  test("returns false for an open request exactly at its SLA deadline", () => {
    // Arrange
    const request = { id: 4, priority: 1, createdAt, status: "open" };
    const now = hoursAfter(4);

    // Act
    const result = isOverdue(request, now);

    // Assert
    expect(result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// RequestCounter
// ---------------------------------------------------------------------------
describe("RequestCounter", () => {
  let counter: RequestCounter;

  // Fresh instance per test so no state is shared
  beforeEach(() => {
    counter = new RequestCounter();
  });

  test("starts at zero", () => {
    // Arrange: done in beforeEach

    // Act
    const result = counter.count;

    // Assert
    expect(result).toBe(0);
  });

  test("increases the count by one after one increment", () => {
    // Arrange: done in beforeEach

    // Act
    counter.increment();

    // Assert
    expect(counter.count).toBe(1);
  });

  test("does not share state between instances", () => {
    // Arrange
    const other = new RequestCounter();

    // Act
    counter.increment();

    // Assert
    expect(other.count).toBe(0);
  });
});

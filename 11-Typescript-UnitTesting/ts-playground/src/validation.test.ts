import { describe, test, expect } from "vitest";
import { validatePriority } from "./validation";

describe("validatePriority", () => {
  describe("valid input", () => {
    // Data-driven test #3: boundaries and a middle value
    test.each([
      { priority: 1, label: "the lower boundary" },
      { priority: 3, label: "a middle value" },
      { priority: 5, label: "the upper boundary" },
    ])("accepts priority $priority ($label)", ({ priority }) => {
      // Arrange: the priority comes from the table

      // Act
      const act = () => validatePriority(priority);

      // Assert
      expect(act).not.toThrow();
    });
  });

  describe("out-of-range input", () => {
    // Data-driven test #4 (error)
    test.each([
      { priority: 0, label: "one below the lower boundary" },
      { priority: 6, label: "one above the upper boundary" },
      { priority: -3, label: "a negative number" },
    ])("rejects priority $priority ($label)", ({ priority }) => {
      // Arrange: the priority comes from the table

      // Act
      const act = () => validatePriority(priority);

      // Assert
      expect(act).toThrow("Priority must be 1-5");
    });
  });

  describe("invalid types", () => {
    // Error test #3
    test("rejects null with a clear error message", () => {
      // Arrange
      const priority = null as unknown as number;

      // Act
      const act = () => validatePriority(priority);

      // Assert
      expect(act).toThrow("Priority must be 1-5");
    });

    // Error test #4
    test("rejects undefined with a clear error message", () => {
      // Arrange
      const priority = undefined as unknown as number;

      // Act
      const act = () => validatePriority(priority);

      // Assert
      expect(act).toThrow("Priority must be 1-5");
    });

    test('rejects a numeric string such as "3"', () => {
      // Arrange
      const priority = "3" as unknown as number;

      // Act
      const act = () => validatePriority(priority);

      // Assert
      expect(act).toThrow("Priority must be 1-5");
    });

    test("rejects a non-integer such as 2.5", () => {
      // Arrange
      const priority = 2.5;

      // Act
      const act = () => validatePriority(priority);

      // Assert
      expect(act).toThrow("Priority must be 1-5");
    });

    test("rejects NaN", () => {
      // Arrange
      const priority = NaN;

      // Act
      const act = () => validatePriority(priority);

      // Assert
      expect(act).toThrow("Priority must be 1-5");
    });
  });
});

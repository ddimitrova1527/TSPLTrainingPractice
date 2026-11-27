import { describe, test, expect } from 'vitest';
import { slaHours, isOverdue } from './sla';
import { ServiceRequest } from './types';
import { toRequest } from './validation'

describe('sla tests', () => {
  test('returns 4 hours for priority 1', () => {
    expect(slaHours(1)).toBe(4);
  });

  test('marks an open P1 request as overdue after 5 hours', () => {
        // Arrange
        const request: ServiceRequest = {
            id: 1, title: 'Street light', priority: 1, status: 'Submitted', hoursOpen: 5,
        };

        // Act
        const result = isOverdue(request);

        // Assert
        expect(result).toBe(true);
    });

  test.each([
    { id: 1, title: 'Street light', priority: 1, status: 'Submitted', hoursOpen: 5},
    { id: 1, title: 'Street light', priority: 4, status: 'Submitted', hoursOpen: 5},
    { id: 1, title: 'Street light', priority: 5, status: 'Submitted', hoursOpen: 5},
    { id: 1, title: 'Street light', priority: 2, status: 'Submitted', hoursOpen: 5},
  ])('Request Parsing for valid requests by priority: $priority', (request: unknown) => {
    expect(() => { toRequest(request) }).not.toThrow(Error);
    expect(toRequest(request)).toBeDefined();
  })

  test('toRequest throws Error when Title with less than 4 sybmols is passed', () => {
        // Arrange
        const request: unknown = {
            id: 1, title: '333', priority: 1, status: 'Submitted', hoursOpen: 5,
        };

        // Act, Assert
        expect(() => { toRequest(request) }).toThrow('At least 5 characters');
    });

    test('toRequest throws Error when Priority not within 1-5 is passed', () => {
        // Arrange
        const request: unknown = {
            id: 1, title: 'Valid Title', priority: 24235, status: 'Submitted', hoursOpen: 5,
        };

        // Act, Assert
        expect(() => { toRequest(request) }).toThrow('Priority not in range 1-5');
    });
});

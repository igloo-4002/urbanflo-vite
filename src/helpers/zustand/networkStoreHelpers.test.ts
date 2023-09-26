import { createRouteId } from './NetworkStoreHelpers';

describe('createRouteId', () => {
  // Test 1: Function should correctly create a route ID from valid "from" and "to" strings
  it('should create a valid route ID', () => {
    const from = 'start_1';
    const to = 'end_2';
    const expectedRouteId = 'start_to_2';

    const result = createRouteId(from, to);
    expect(result).toEqual(expectedRouteId);
  });

  // Test 2: Function should handle empty strings
  it('should handle empty strings', () => {
    const from = '';
    const to = '';
    const expectedRouteId = '_to_undefined';

    const result = createRouteId(from, to);
    expect(result).toEqual(expectedRouteId);
  });

  // Test 3: Function should handle strings without underscores
  it('should handle strings without underscores', () => {
    const from = 'start';
    const to = 'end';
    const expectedRouteId = 'start_to_undefined';

    const result = createRouteId(from, to);
    expect(result).toEqual(expectedRouteId);
  });

  // Test 4: Function should handle strings with multiple underscores
  it('should handle strings with multiple underscores', () => {
    const from = 'start_1_2';
    const to = 'end_3_4';
    const expectedRouteId = 'start_to_3';

    const result = createRouteId(from, to);
    expect(result).toEqual(expectedRouteId);
  });

  // Additional tests can be added based on the expected behavior of your function
});

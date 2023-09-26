import { Point } from '~/types/Network';

import {
  arePointsEqual,
  createRouteId,
  removeItems,
} from './NetworkStoreHelpers';

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
});

describe('arePointsEqual', () => {
  it('should return true for equal points', () => {
    const point1: Point = { x: 1, y: 2 };
    const point2: Point = { x: 1, y: 2 };
    expect(arePointsEqual(point1, point2)).toBe(true);
  });

  it('should return false for points with different x coordinates', () => {
    const point1: Point = { x: 1, y: 2 };
    const point2: Point = { x: 2, y: 2 };
    expect(arePointsEqual(point1, point2)).toBe(false);
  });

  it('should return false for points with different y coordinates', () => {
    const point1: Point = { x: 1, y: 2 };
    const point2: Point = { x: 1, y: 3 };
    expect(arePointsEqual(point1, point2)).toBe(false);
  });

  it('should return false for points with both x and y coordinates different', () => {
    const point1: Point = { x: 1, y: 2 };
    const point2: Point = { x: 2, y: 3 };
    expect(arePointsEqual(point1, point2)).toBe(false);
  });
});

describe('removeItems', () => {
  it('should remove items based on condition', () => {
    const items = { a: 1, b: 2, c: 3 };
    const condition = (item: number) => item > 2;
    const result = removeItems(items, condition);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should not remove any items if condition is not met', () => {
    const items = { a: 1, b: 2, c: 3 };
    const condition = (item: number) => item > 5;
    const result = removeItems(items, condition);
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should remove all items if condition is always true', () => {
    const items = { a: 1, b: 2, c: 3 };
    const condition = (_item: number) => true;
    const result = removeItems(items, condition);
    expect(result).toEqual({});
  });

  it('should not mutate the original items object', () => {
    const items = { a: 1, b: 2, c: 3 };
    const condition = (item: number) => item > 2;
    const _result = removeItems(items, condition);
    expect(items).toEqual({ a: 1, b: 2, c: 3 });
  });
});

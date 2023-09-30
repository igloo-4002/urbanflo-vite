import { formatISOString } from './formatter';

describe('formatISOString', () => {
  it('should correctly format ISO string to date and time', () => {
    const result = formatISOString('2021-09-25T14:15:22.000Z');
    expect(result).toEqual({
      date: '25/09/21',
      time: '2:15 PM',
    });
  });

  it('should correctly handle dates with single-digit day and month', () => {
    const result = formatISOString('2021-09-05T04:05:22.000Z');
    expect(result).toEqual({
      date: '05/09/21',
      time: '4:05 AM',
    });
  });

  it('should throw an error for invalid date strings', () => {
    expect(() => {
      formatISOString('invalid-date');
    }).toThrow();
  });

  it('should return the correct time in 12-hour format', () => {
    const result = formatISOString('2021-09-25T14:05:22.000Z');
    expect(result.time).toBe('2:05 PM');
  });

  it('should correctly handle leap years', () => {
    const result = formatISOString('2020-02-29T14:05:22.000Z');
    expect(result).toEqual({
      date: '29/02/20',
      time: '2:05 PM',
    });
  });
});

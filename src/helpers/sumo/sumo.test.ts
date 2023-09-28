import { extractCarsFromSumoMessage } from '.';

describe('extractCarsFromSumoMessage', () => {
  it('should throw error for invalid JSON', () => {
    expect(() => {
      extractCarsFromSumoMessage('invalid JSON');
    }).toThrowError('Invalid JSON format');
  });

  it('should throw error for invalid car format (missing position)', () => {
    const sumoMessage = JSON.stringify({
      'vehicle-1': { vehicleId: 'vehicle-1', position: {} },
    });
    expect(() => {
      extractCarsFromSumoMessage(sumoMessage);
    }).toThrowError('Response is not in car format');
  });

  it('should return an empty array for an empty input', () => {
    const sumoMessage = JSON.stringify({});
    const cars = extractCarsFromSumoMessage(sumoMessage);
    expect(cars).toEqual([]);
  });

  it('should return an array of cars for valid input', () => {
    const sumoMessage = JSON.stringify({
      'vehicle-1': {
        vehicleId: 'vehicle-1',
        position: { first: 1, second: 2 },
      },
      'vehicle-2': {
        vehicleId: 'vehicle-2',
        position: { first: 3, second: 4 },
      },
    });
    const cars = extractCarsFromSumoMessage(sumoMessage);
    expect(cars).toEqual([
      { location: { x: 1, y: 2 }, color: 'red' },
      { location: { x: 3, y: 4 }, color: 'red' },
    ]);
  });
});

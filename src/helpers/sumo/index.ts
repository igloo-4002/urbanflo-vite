import { Car } from '~/zustand/useCarStore';

export type SumoMessage = {
  [vehicleId: string]: {
    vehicleId: string;
    position: {
      first: number;
      second: number;
    };
    color: string;
    acceleration: number;
    speed: number;
    lane: {
      first: number;
      second: string;
    };
  };
};

/**
 * Extracts and transforms cars from a SUMO message to match the required Car format.
 * @param {string} sumoMessage - The SUMO message as a JSON string.
 * @returns {Car[]} An array of cars transformed from the SUMO message.
 * @throws {Error} Throws an error if the SUMO message is in an invalid format or cannot be parsed.
 */
export function extractCarsFromSumoMessage(sumoMessage: string): Car[] {
  let parsedJson: SumoMessage;
  const cars: Car[] = [];

  try {
    parsedJson = JSON.parse(sumoMessage);
  } catch (err) {
    throw new Error('Invalid JSON format');
  }

  for (const vehicleId in parsedJson) {
    const vehicle = parsedJson[vehicleId];
    if (
      !vehicle.position ||
      !vehicle.position.first ||
      !vehicle.position.second
    ) {
      throw new Error('Response is not in car format');
    }

    cars.push({
      location: {
        x: vehicle.position.first,
        y: vehicle.position.second,
      },
      color: 'red', // we accept the fact that SUMO may not return this since its not too important
    });
  }

  return cars;
}

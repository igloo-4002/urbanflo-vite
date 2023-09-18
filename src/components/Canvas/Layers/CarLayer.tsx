import { Layer } from 'react-konva';

import { Point } from '~/types/Network';
import { useCarsStore } from '~/zustand/useCarStore';
import { useMeasurements } from '~/zustand/useMeasurement';

import { Car } from '../Car';

function isPointOnLine(
  point: Point,
  lineStart: Point,
  lineEnd: Point,
): boolean {
  const A = lineEnd.y - lineStart.y;
  const B = lineStart.x - lineEnd.x;
  const C = A * lineStart.x + B * lineStart.y;

  const distance =
    Math.abs(A * point.x + B * point.y - C) / Math.sqrt(A * A + B * B);

  /**
  if (distance < 1) {
    console.log({
      distance,
    });
  }
     */

  return distance < 1; // Some small threshold
}

export function CarLayer() {
  const carStore = useCarsStore();

  return (
    <Layer>
      {carStore.cars.map((car, index) => {
        return <Car car={car} key={index} />;
      })}
    </Layer>
  );
}

useCarsStore.subscribe(cars => {
  const measurements = useMeasurements.getState();
  const flowMeasurements = Object.values(measurements.flowMeasurements);

  for (const car of cars.cars) {
    for (const flowMeasurement of flowMeasurements) {
      if (isPointOnLine(car.location, flowMeasurement.A, flowMeasurement.B)) {
        measurements.updateFlowMeasurement(
          flowMeasurement.id,
          flowMeasurement.flow + 1,
        );
      }
    }
  }
});

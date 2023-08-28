import { Circle } from 'react-konva';

import { Car as CarType } from '~/zustand/useCarStore';

interface CarProps {
  car: CarType;
}

export function Car({ car }: CarProps) {
  return <Circle x={car.location.x} y={car.location.y} fill={car.color} />;
}

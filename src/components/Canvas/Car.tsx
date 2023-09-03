import { Circle } from 'react-konva';

import { Car as CarType } from '~/zustand/useCarStore';

interface CarProps {
  car: CarType;
}

export function Car({ car }: CarProps) {
  return (
    <Circle
      width={5}
      height={5}
      x={car.location.x}
      y={car.location.y}
      fill={car.color}
    />
  );
}

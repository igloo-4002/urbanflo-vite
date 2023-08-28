import { Circle } from 'react-konva';

import { Car } from '~/zustand/useCarStore';

interface CarProps {
  car: Car;
}

export function Car({ car }: CarProps) {
  return (
    <Circle x={car.location.x} y={car.location.y} fill={car.color}/>
  );
}


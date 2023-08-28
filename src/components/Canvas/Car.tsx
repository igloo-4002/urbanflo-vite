import { Circle, Group, Rect } from 'react-konva';

import { Car as CarType } from '~/zustand/useCarStore';

interface CarProps {
  car: CarType;
}

export function Car({ car }: CarProps) {
  const carWidth = 20;
  const carLength = 40;
  const wheelSize = 4;

  const { x, y } = car.location;

  // Calculate the positions for the car body and wheels
  const bodyX = x - carWidth / 2;
  const bodyY = y - carLength / 2;

  return (
    <Group>
      {/* Car Body */}
      <Rect
        x={bodyX}
        y={bodyY}
        width={carWidth}
        height={carLength}
        fill={car.color}
      />
      {/* Front-left Wheel */}
      <Circle x={bodyX} y={bodyY} radius={wheelSize} fill="black" />
      {/* Front-right Wheel */}
      <Circle x={bodyX + carWidth} y={bodyY} radius={wheelSize} fill="black" />
      {/* Rear-left Wheel */}
      <Circle x={bodyX} y={bodyY + carLength} radius={wheelSize} fill="black" />
      {/* Rear-right Wheel */}
      <Circle
        x={bodyX + carWidth}
        y={bodyY + carLength}
        radius={wheelSize}
        fill="black"
      />
    </Group>
  );
}

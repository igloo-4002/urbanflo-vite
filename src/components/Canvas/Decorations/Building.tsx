import { Group, Rect, Text } from 'react-konva';

import seedrandom from 'seedrandom';

import { Decoration } from '~/zustand/useDecorations';

interface BuildingProps {
  building: Decoration;
}

export function Building(props: BuildingProps) {
  const rng = seedrandom(props.building.seed);

  const { x, y } = props.building;

  // Squares!
  const width = rng() * 50 + 25;
  const height = width;

  // Colors for the roof
  const colors = ['darkgray', 'lightgray', 'gray'];

  return (
    <Group>
      {/* Building structure */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={colors[Math.floor(rng() * colors.length)]} // Random color selection
      />
      {/* Letter "B" on the roof */}
      <Text
        x={x + width / 4}
        y={y + height / 4}
        width={width / 2}
        height={height / 2}
        text="B"
        fontSize={Math.min(width, height) / 2} // Adjust font size based on building size
        fontFamily="Arial"
        fill="white"
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
}

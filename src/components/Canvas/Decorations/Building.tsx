import React from 'react';
import { Group, Rect, Text } from 'react-konva';

import { Decoration } from '~/zustand/useDecorations';

interface BuildingProps {
  building: Decoration;
}

function BuildingComponent(props: BuildingProps) {
  const { x, y } = props.building;

  // Squares!
  const width = 65;
  const height = width;

  // Colors for the roof

  return (
    <Group>
      {/* Building structure */}
      <Rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        fill={'darkgray'}
      />
      {/* Letter "B" on the roof */}
      <Text
        x={x - width / 4}
        y={y - height / 4}
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

export const Building = React.memo(BuildingComponent);

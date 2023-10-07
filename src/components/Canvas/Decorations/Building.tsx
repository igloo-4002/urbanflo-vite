import React from 'react';
import { Group, Rect, Text } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';

import { Decoration, useDecorationStore } from '~/zustand/useDecorations';

interface BuildingProps {
  building: Decoration;
}

function BuildingComponent(props: BuildingProps) {
  const decorationsStore = useDecorationStore();
  const { x, y } = props.building;

  // Squares!
  const width = 65;
  const height = width;

  function handleBuildingMove(event: KonvaEventObject<DragEvent>) {
    const updatedBuilding = {
      ...props.building,
      x: event.target.x(),
      y: event.target.y(),
    };

    decorationsStore.updateItem(props.building.id, updatedBuilding);
  }

  return (
    <Group>
      {/* Building structure */}
      <Rect
        draggable
        onDragMove={handleBuildingMove}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={'darkgray'}
      />
      {/* Letter "B" on the roof */}
      <Text
        onClick={() => console.log('clicking the B')}
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

export const Building = React.memo(BuildingComponent);

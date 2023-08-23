import { Arrow, Group } from 'react-konva';

import { Edge, useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelected';

interface RoadProps {
  edge: Edge;
}

export function Road({ edge }: RoadProps) {
  const network = useNetworkStore();
  const selector = useSelector();

  const isSelected = selector.selected === edge.id;

  const from = network.nodes[edge.from];
  const to = network.nodes[edge.to];

  const roadColor = 'grey';
  const laneWidth = 25;
  const centerlineColor = 'white';
  const highlightColor = '#FFAE42';

  function handleRoadClick() {
    if (selector.selected !== edge.id) {
      selector.select(edge.id);
    } else if (selector.selected === edge.id) {
      selector.deselect();
    }
  }

  const commonProps = {
    points: [0, 0, to.x - from.x, to.y - from.y],
    pointerLength: 0,
    pointerWidth: 0,
    zIndex: -1,
  };

  return (
    <Group onClick={handleRoadClick}>
      {/* Highlight for selected road */}
      <Arrow
        key={`road-selected-stroke-${edge.id}`}
        x={from.x}
        y={from.y}
        stroke={isSelected ? highlightColor : 'transparent'}
        strokeWidth={laneWidth * edge.numLanes + 8}
        {...commonProps}
      />

      {/* Grey Road */}
      <Arrow
        key={`road-${edge.id}`}
        x={from.x}
        y={from.y}
        fill={roadColor}
        stroke={roadColor}
        strokeWidth={laneWidth * edge.numLanes}
        {...commonProps}
      />

      {/* Lanes */}
      {Array.from({ length: edge.numLanes - 1 }).map((_, index) => {
        const yOffset =
          (index + 0.5) * laneWidth - (edge.numLanes - 1) * (laneWidth / 2);

        return (
          <Arrow
            key={`centerline-${edge.id}-${index}`}
            x={from.x}
            y={from.y + yOffset}
            dash={[10, 10]}
            fill="transparent"
            stroke={centerlineColor}
            strokeWidth={2}
            {...commonProps}
          />
        );
      })}
    </Group>
  );
}

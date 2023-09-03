import { Arrow, Group, Line } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';

import { centerlineColor, highlightColor, roadColor } from '~/colors';
import { Edge } from '~/types/Network';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelected';

interface RoadProps {
  edge: Edge;
}

export const laneWidth = 25;

export function Road({ edge }: RoadProps) {
  const network = useNetworkStore();
  const selector = useSelector();

  const isSelected = selector.selected === edge.id;

  const from = network.nodes[edge.from];
  const to = network.nodes[edge.to];

  function handleRoadClick(event: KonvaEventObject<MouseEvent>) {
    event.cancelBubble = true;
    if (selector.selected !== edge.id) {
      selector.select(edge.id);
    } else if (selector.selected === edge.id) {
      selector.deselect();
    }
  }

  const angleRad = Math.atan2(to.y - from.y, to.x - from.x);

  // Calculate the offset in both x and y directions
  const dx = laneWidth * Math.sin(angleRad);
  const dy = laneWidth * Math.cos(angleRad);

  return (
    <Group onClick={handleRoadClick}>
      {/* Highlight for selected road */}
      <Arrow
        key={`road-selected-stroke-${edge.id}`}
        x={from.x}
        y={from.y}
        points={[dx, -dy, to.x - from.x + dx, to.y - from.y - dy]}
        stroke={isSelected ? highlightColor : 'transparent'}
        strokeWidth={laneWidth * edge.numLanes + 8}
        pointerLength={0}
        pointerWidth={0}
      />

      {/* Grey Road */}
      <Arrow
        key={`road-${edge.id}`}
        x={from.x}
        y={from.y}
        points={[dx, -dy, to.x - from.x + dx, to.y - from.y - dy]}
        fill={roadColor}
        stroke={roadColor}
        strokeWidth={laneWidth * edge.numLanes}
        pointerLength={0}
        pointerWidth={0}
      />

      {/* Lanes */}
      {Array.from({ length: edge.numLanes - 1 }).map((_, index) => {
        const offset = (index + 0.5 - (edge.numLanes - 1) / 2) * laneWidth;

        return (
          <Line
            key={`centerline-${edge.id}-${index}`}
            x={from.x + offset * Math.sin(angleRad)}
            y={from.y - offset * Math.cos(angleRad)}
            points={[dx, -dy, to.x - from.x + dx, to.y - from.y - dy]}
            dash={[10, 10]}
            stroke={centerlineColor}
            strokeWidth={2}
          />
        );
      })}
    </Group>
  );
}

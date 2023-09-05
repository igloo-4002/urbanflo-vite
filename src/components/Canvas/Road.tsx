import { Group, Line } from 'react-konva';

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

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  const px = dy;
  const py = -dx;

  const length = Math.sqrt(px * px + py * py);
  const ux = (px / length) * laneWidth * edge.numLanes;
  const uy = (py / length) * laneWidth * edge.numLanes;

  const points = [
    0,
    0,
    ux,
    uy,
    to.x - from.x + ux,
    to.y - from.y + uy,
    to.x - from.x,
    to.y - from.y,
  ];

  return (
    <Group onClick={handleRoadClick}>
      {/* Highlight */}
      {isSelected && (
        <Line
          key={`edge-highlight-${edge.id}`}
          x={from.x}
          y={from.y}
          points={points}
          closed
          stroke={highlightColor}
          strokeWidth={4}
        />
      )}

      {/* Gray road */}
      <Line
        key={edge.id}
        x={from.x}
        y={from.y}
        points={points}
        closed
        fill={roadColor}
      />
      {/* Lanes */}
      {Array.from({ length: edge.numLanes - 1 }, (_, index) => {
        const midX = ux / 2;
        const midY = uy / 2;
        const midEndX = (to.x - from.x + to.x - from.x + ux) / 2;
        const midEndY = (to.y - from.y + to.y - from.y + uy) / 2;

        const offset = (index + 0.5 - (edge.numLanes - 1) / 2) * laneWidth;
        const laneStartX = midX + (px / length) * offset;
        const laneStartY = midY + (py / length) * offset;
        const laneEndX = midEndX + (px / length) * offset;
        const laneEndY = midEndY + (py / length) * offset;

        return (
          <Line
            key={`lane-${edge.id}-${index}`}
            x={from.x}
            y={from.y}
            points={[laneStartX, laneStartY, laneEndX, laneEndY]}
            dash={[10, 10]}
            stroke={centerlineColor}
            strokeWidth={2}
          />
        );
      })}
    </Group>
  );
}

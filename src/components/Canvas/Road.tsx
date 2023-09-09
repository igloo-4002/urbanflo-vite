import { Group, Line, Path } from 'react-konva';

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

  const roadPath = `M ${from.x} ${from.y} L ${from.x + ux} ${from.y + uy} L ${
    to.x + ux
  } ${to.y + uy} L ${to.x} ${to.y} Z`;

  return (
    <Group onClick={handleRoadClick}>
      {/* Gray road */}
      <Path
        data={roadPath}
        fill={roadColor}
        stroke={isSelected ? highlightColor : 'transparent'}
        strokeWidth={isSelected ? 3 : 0}
      />

      {/* Lanes */}
      {Array.from({ length: edge.numLanes - 1 }).map((_, index) => {
        const laneOffset = (ux / edge.numLanes) * (index + 1);
        const laneUx = from.x + laneOffset;
        const laneUy = from.y + (uy / edge.numLanes) * (index + 1);
        const laneToX = to.x + laneOffset;
        const laneToY = to.y + (uy / edge.numLanes) * (index + 1);

        return (
          <Line
            key={`${edge.id}-lane-${index}`}
            points={[laneUx, laneUy, laneToX, laneToY]}
            stroke={centerlineColor}
            strokeWidth={2}
            dash={[10, 10]}
          />
        );
      })}
    </Group>
  );
}

import { Group, Line } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';

import { roadColor } from '~/colors';
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

  // const isSelected = selector.selected === edge.id;

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
      {/* Gray road */}
      <Line x={from.x} y={from.y} points={points} closed fill={roadColor} />

      {/* Lanes */}
    </Group>
  );
}

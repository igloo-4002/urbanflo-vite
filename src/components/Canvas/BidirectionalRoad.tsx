import { Arrow } from 'react-konva';

import { Edge } from '~/types/Network';
import { useNetworkStore } from '~/zustand/useNetworkStore';

import { Road, laneWidth } from './Road';

interface BidirectionalRoadProps {
  edge: Edge;
  oppositeEdge: Edge;
}

export function BidirectionalRoad({
  edge,
  oppositeEdge,
}: BidirectionalRoadProps) {
  const networkStore = useNetworkStore();

  const road1TotalWidth = laneWidth * edge.numLanes;
  const road2TotalWidth = laneWidth * oppositeEdge.numLanes;

  const from = networkStore.nodes[edge.from];
  const to = networkStore.nodes[edge.to];

  return (
    <>
      <Road edge={edge} offset={-road1TotalWidth / 2} />
      <Road edge={oppositeEdge} offset={-road2TotalWidth / 2} />
      <Arrow
        x={from.x}
        y={from.y}
        points={[0, 0, to.x - from.x, to.y - from.y]}
        stroke="white"
        strokeWidth={2}
        pointerWidth={0}
        pointerLength={0}
      />
    </>
  );
}

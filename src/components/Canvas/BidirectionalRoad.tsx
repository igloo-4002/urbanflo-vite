import { Edge } from '~/types/Network';

interface BidirectionalRoadProps {
  edge: Edge;
  oppositeEdge: Edge;
}

export const laneWidth = 25;

export function BidirectionalRoad({
  edge,
  oppositeEdge,
}: BidirectionalRoadProps) {
  console.log(edge, oppositeEdge);

  return <></>;
}

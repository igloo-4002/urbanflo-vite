import { Edge } from '~/types/Network';

interface BidirectionalRoadProps {
  edge: Edge;
  reverseEdge: Edge;
}

export const laneWidth = 25;

export function BidirectionalRoad({
  edge,
  reverseEdge,
}: BidirectionalRoadProps) {
  console.log(edge, reverseEdge);

  return <></>;
}

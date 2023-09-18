import { Arrow, Text } from 'react-konva';

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

  // Printing road name : Angle and Placement
    // Calculate the difference in X and Y coordinates
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;
  
    // Use Math.atan2 to calculate the angle in radians
    const radians = Math.atan2(deltaY, deltaX);
  
    // Convert radians to degrees
    const degrees = (radians * 180) / Math.PI;
  
    // Ensure the result is a positive angle between 0 and 360 degrees
    const positiveDegrees = (degrees + 360) % 360;

    let degreeDisplay;
    let xName;
    let yName;

    if (positiveDegrees < 45 || positiveDegrees >= 270) {
      degreeDisplay= positiveDegrees
      xName=from.x + 25
      yName=from.y-50
    }
    else if (45 <= positiveDegrees && positiveDegrees < 90) {
      degreeDisplay = positiveDegrees
      xName= from.x +50
      yName= from.y
    }
    else if (positiveDegrees >= 90 && positiveDegrees < 270) {
      degreeDisplay = positiveDegrees - 180
      xName= from.x - 100
      yName= from.y - 50

    }
    console.log(degreeDisplay)

  return (
    <>
      <Text
        x={xName}
        y={yName}
        text={edge.name}
        fontSize={14} // Adjust font size as needed
        fill="black" // Adjust text color as needed
        align="center"
        rotation={degreeDisplay}
      />
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

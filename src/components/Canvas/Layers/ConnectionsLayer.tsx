import { Layer, Line } from 'react-konva';

import { Edge, Point } from '~/types/Network';
import { Network, useNetworkStore } from '~/zustand/useNetworkStore';

function adjustControlPoint(
  source: Point,
  centre: Point,
  destination: Point,
  scaleFactor: number,
) {
  // Calculate direction vector from the source to the centre
  const directionFromSource = {
    x: centre.x - source.x,
    y: centre.y - source.y,
  };

  // Calculate direction vector from the destination to the centre
  const directionFromDestination = {
    x: centre.x - destination.x,
    y: centre.y - destination.y,
  };

  // Compute adjustments from both directions
  const adjustmentFromSource = {
    x: directionFromSource.x * scaleFactor,
    y: directionFromSource.y * scaleFactor,
  };

  const adjustmentFromDestination = {
    x: directionFromDestination.x * scaleFactor,
    y: directionFromDestination.y * scaleFactor,
  };

  // Average the adjustments to get the final control position
  const adjustedControl = {
    x: centre.x + (adjustmentFromSource.x + adjustmentFromDestination.x) / 2,
    y: centre.y + (adjustmentFromSource.y + adjustmentFromDestination.y) / 2,
  };

  return adjustedControl;
}

function quadraticBezier(inward: Edge, outward: Edge, network: Network) {
  const source: Point = {
    x: network.nodes[inward.from].x,
    y: network.nodes[inward.from].y,
  };

  // the centre of the node joining these two edges is the control point
  const centre: Point = {
    x: network.nodes[inward.to].x,
    y: network.nodes[inward.to].y,
  };

  const destination: Point = {
    x: network.nodes[outward.to].x,
    y: network.nodes[outward.to].y,
  };

  const control = adjustControlPoint(source, centre, destination, 0.3);

  return [source, control, destination] as const;
}

export function ConnectionsLayer() {
  const network = useNetworkStore();
  const connections = Object.values(network.connections);

  const paths = connections.map((connection, index) => {
    const inward = network.edges[connection.from];
    const outward = network.edges[connection.to];

    const [source, control, destination] = quadraticBezier(
      inward,
      outward,
      network,
    );

    return (
      <Line
        key={index}
        points={[
          source.x,
          source.y,
          control.x,
          control.y,
          control.x,
          control.y,
          destination.x,
          destination.y,
        ]}
        stroke={'#FF0000'}
        strokeWidth={2}
        bezier
      />
    );
  });

  return <Layer>{paths}</Layer>;
}

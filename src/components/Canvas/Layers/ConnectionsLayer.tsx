import { Layer, Line } from 'react-konva';

import { useNetworkStore } from '~/zustand/useNetworkStore';

export function ConnectionsLayer() {
  const network = useNetworkStore();
  const connections = Object.values(network.connections);

  return (
    <Layer>
      {connections.map(connection => {
        const inbound = network.edges[connection.from];
        const outbound = network.edges[connection.to];
        const over = network.nodes[connection.over];

        const source = network.nodes[inbound.from];
        const sink = network.nodes[outbound.to];
        const control = { x: over.x, y: over.y };

        const points = [
          source.x,
          source.y,
          control.x,
          control.y,
          sink.x,
          sink.y,
        ];

        return (
          <Line
            key={`${connection.from}-${connection.to}`}
            points={points}
            stroke="black"
            strokeWidth={2}
            bezier
          />
        );
      })}
    </Layer>
  );
}

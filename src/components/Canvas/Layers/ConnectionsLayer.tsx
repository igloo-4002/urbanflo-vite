import { Layer, Line } from 'react-konva';

import { getEdgeTerminals } from '~/helpers/zustand/NetworkStoreHelpers';
import { useNetworkStore } from '~/zustand/useNetworkStore';

export function ConnectionsLayer() {
  const network = useNetworkStore();
  const connections = Object.values(network.connections);

  return (
    <Layer>
      {connections.map((connection, index) => {
        const inward = network.edges[connection.from];
        const outward = network.edges[connection.to];

        const { leading: leadingTerminals } = getEdgeTerminals(inward);
        const { trailing: trailingTerminals } = getEdgeTerminals(outward);

        const leading = leadingTerminals[connection.fromLane];
        const trailing = trailingTerminals[connection.toLane];

        const control = {
          x: network.nodes[inward.to].x,
          y: network.nodes[inward.to].y,
        };

        return (
          <Line
            key={index}
            points={[
              leading.x,
              leading.y,
              control.x,
              control.y,
              control.x,
              control.y,
              trailing.x,
              trailing.y,
            ]}
            bezier
            stroke={'red'}
            strokeWidth={2}
          />
        );
      })}
    </Layer>
  );
}

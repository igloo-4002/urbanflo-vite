import { Layer, Line } from 'react-konva';

import { Point } from '~/types/Network';
import { useNetworkStore } from '~/zustand/useNetworkStore';

export function ConnectionsLayer() {
  const network = useNetworkStore();
  const connections = Object.values(network.connections);

  return (
    <Layer>
      {connections.map((conn, index) => {
        // help

        return (
          <Line
            key={index}
            bezier
            // points={[0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]}
          />
        );
      })}
    </Layer>
  );
}

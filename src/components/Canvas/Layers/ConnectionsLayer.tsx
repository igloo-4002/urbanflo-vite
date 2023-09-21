import { Circle, Layer } from 'react-konva';

import { getEdgeTerminals } from '~/helpers/zustand/NetworkStoreHelpers';
import { useNetworkStore } from '~/zustand/useNetworkStore';

export function ConnectionsLayer() {
  const network = useNetworkStore();
  const edges = Object.values(network.edges);

  const edgeTerminals = edges.map(edge => getEdgeTerminals(edge, 50, 50));

  const flattenedEdgeTerminals = edgeTerminals.flatMap(edge => [
    ...edge.leading,
    ...edge.trailing,
  ]);

  return (
    <Layer>
      {flattenedEdgeTerminals.map((terminal, index) => (
        <Circle
          key={index}
          x={terminal.x}
          y={terminal.y}
          fill="red"
          radius={4}
        />
      ))}
    </Layer>
  );
}

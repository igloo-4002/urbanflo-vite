import { Layer } from 'react-konva';

import { useNetworkStore } from '~/zustand/useNetworkStore';

import { Road } from '../Road';

export function RoadsLayer() {
  const network = useNetworkStore();
  const edges = Object.values(network.edges);
  const renderedEdges = new Set(); // Keep track of bidirectional roads that are already rendered

  return (
    <Layer>
      {edges.map((edge, index) => {
        const isRendered = renderedEdges.has(edge.id);

        if (isRendered) {
          return null; // Skip rendering if this edge has already been rendered
        }

        const bidirectionalEdge = network.edges[`${edge.to}_${edge.from}`];

        if (bidirectionalEdge) {
          renderedEdges.add(bidirectionalEdge.id); // Mark the edge going the other way as rendered.
        }

        return <Road edge={edge} reverseEdge={bidirectionalEdge} key={index} />;
      })}
    </Layer>
  );
}

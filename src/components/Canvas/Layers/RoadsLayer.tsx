import { Layer } from 'react-konva';

import { useNetworkStore } from '~/zustand/useNetworkStore';

import { BidirectionalRoad } from '../BidirectionalRoad';
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

        const oppositeEdge = network.edges[`${edge.to}_${edge.from}`];

        if (oppositeEdge) {
          renderedEdges.add(oppositeEdge.id); // Mark the edge going the other way as rendered.
          return (
            <BidirectionalRoad
              edge={edge}
              oppositeEdge={oppositeEdge}
              key={index}
            />
          );
        }

        return <Road edge={edge} key={index} />;
      })}
    </Layer>
  );
}

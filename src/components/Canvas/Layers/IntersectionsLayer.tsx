import { Layer } from 'react-konva';

import { useNetworkStore } from '~/zustand/useNetworkStore';

import { Intersection } from '../Intersection';

export function IntersectionsLayer() {
  const network = useNetworkStore();
  const nodes = Object.values(network.nodes);
  return (
    <Layer>
      {nodes.map((node, index) => {
        return <Intersection key={index} node={node} />;
      })}
    </Layer>
  );
}

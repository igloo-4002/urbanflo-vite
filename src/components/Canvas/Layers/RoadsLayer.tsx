import { Layer } from 'react-konva';

import { useNetworkStore } from '~/zustand/useNetworkStore';

import { Road } from '../Road';

export function RoadsLayer() {
  const network = useNetworkStore();
  const edges = Object.values(network.edges);

  return (
    <Layer>
      {edges.map((edge, index) => {
        return <Road edge={edge} key={index} />;
      })}
    </Layer>
  );
}

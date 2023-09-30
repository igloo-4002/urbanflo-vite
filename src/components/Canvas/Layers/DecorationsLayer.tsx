import { Layer } from 'react-konva';

import { useDecorationStore } from '~/zustand/useDecorations';

import Tree from '../Tree';

export function DecorationsLayer() {
  const decorationsStore = useDecorationStore();

  return (
    <Layer>
      {decorationsStore.items.map((item, index) => {
        return <Tree tree={item} key={index} />;
      })}
    </Layer>
  );
}

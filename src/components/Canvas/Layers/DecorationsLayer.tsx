import { Layer } from 'react-konva';

import { Decoration, useDecorationStore } from '~/zustand/useDecorations';

import { Building } from '../Decorations/Building';
import { Tree } from '../Decorations/Tree';

function isTree(item: Decoration) {
  return item.type === 'tree';
}

function isBuilding(item: Decoration) {
  return item.type === 'building';
}

export function DecorationsLayer() {
  const decorationsStore = useDecorationStore();

  const trees = decorationsStore.items.filter(isTree);
  const buildings = decorationsStore.items.filter(isBuilding);
  return (
    <Layer>
      {trees.map(item => {
        return <Tree tree={item} key={item.id} />;
      })}

      {buildings.map(item => {
        return <Building building={item} key={item.id} />;
      })}
    </Layer>
  );
}

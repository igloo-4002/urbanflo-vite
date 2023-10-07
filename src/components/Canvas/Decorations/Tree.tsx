import { Circle, Group } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';
import seedrandom from 'seedrandom';

import { Decoration, useDecorationStore } from '~/zustand/useDecorations';

interface LeafProps {
  x: number;
  y: number;
  radius: number;
  fill: string;
}

function Leaf({ x, y, radius, fill }: LeafProps) {
  return <Circle x={x} y={y} radius={radius} fill={fill} />;
}

interface TreeProps {
  tree: Decoration;
}

export function Tree(props: TreeProps) {
  const decorationsStore = useDecorationStore();

  const rng = seedrandom(props.tree.seed);

  const leaves = Array.from({ length: 50 }).map(() => ({
    x: props.tree.x + rng() * 60 - 30,
    y: props.tree.y + rng() * 60 - 30,
    radius: rng() * 6 + 2,
    fill: `rgba(0, ${rng() * 255}, 0, 1)`, // Only green shades
  }));

  function handleTreeMove(event: KonvaEventObject<DragEvent>) {
    const updatedTree = {
      ...props.tree,
      x: event.target.x(),
      y: event.target.y(),
    };

    decorationsStore.updateItem(props.tree.id, updatedTree);
  }

  return (
    <Group onDragMove={handleTreeMove} draggable>
      {/* Tree trunk */}
      <Circle x={props.tree.x} y={props.tree.y} radius={20} fill="brown" />

      {/* Leaves */}
      {leaves.map((leaf, index) => (
        <Leaf key={index} {...leaf} />
      ))}
    </Group>
  );
}

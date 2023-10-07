import React from 'react';
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

function TreeComponent(props: TreeProps) {
  const decorationsStore = useDecorationStore();
  const rng = seedrandom(props.tree.seed);

  const leaves = Array.from({ length: 50 }).map(() => ({
    x: props.tree.x + rng() * 60 - 30,
    y: props.tree.y + rng() * 60 - 30,
    radius: rng() * 6 + 2,
    fill: `rgba(0, ${rng() * 255}, 0, 1)`, // Only green shades
  }));

  function handleTreeMove(event: KonvaEventObject<DragEvent>) {
    const deltaX = event.target.x() - props.tree.x;
    const deltaY = event.target.y() - props.tree.y;

    const updatedTree = {
      ...props.tree,
      x: event.target.x(),
      y: event.target.y(),
    };

    decorationsStore.updateItem(props.tree.id, updatedTree);

    // Update the positions of the leaves
    leaves.forEach(leaf => {
      leaf.x += deltaX;
      leaf.y += deltaY;
    });
  }

  return (
    <Group>
      {/* Tree trunk */}
      <Circle
        onDragMove={handleTreeMove}
        draggable
        x={props.tree.x}
        y={props.tree.y}
        radius={20}
        fill="brown"
      />

      {/* Leaves */}
      {leaves.map((leaf, index) => (
        <Leaf key={index} {...leaf} />
      ))}
    </Group>
  );
}

export const Tree = React.memo(TreeComponent);

import { Circle, Group } from 'react-konva';

import { Decoration } from '~/zustand/useDecorations';

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

function Tree(props: TreeProps) {
  const leaves = Array.from({ length: 50 }).map(() => ({
    x: props.tree.x + Math.random() * 100 - 50,
    y: props.tree.y + Math.random() * 100 - 50,
    radius: Math.random() * 5 + 2,
    fill: `rgba(${Math.random() * 255}, ${Math.random() * 255}, 0, 1)`,
  }));

  return (
    <Group>
      {/* Tree trunk */}
      <Circle x={props.tree.x} y={props.tree.y} radius={20} fill="brown" />

      {/* Leaves */}
      {leaves.map((leaf, index) => (
        <Leaf key={index} {...leaf} />
      ))}
    </Group>
  );
}

export default Tree;

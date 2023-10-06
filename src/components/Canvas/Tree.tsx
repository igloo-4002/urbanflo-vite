import { Circle, Group } from 'react-konva';

import seedrandom from 'seedrandom';

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
  const rng = seedrandom(props.tree.seed);

  const leaves = Array.from({ length: 50 }).map(() => ({
    x: props.tree.x + rng() * 100 - 50,
    y: props.tree.y + rng() * 100 - 50,
    radius: rng() * 5 + 2,
    fill: `rgba(${rng() * 255}, ${rng() * 255}, 0, 1)`,
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

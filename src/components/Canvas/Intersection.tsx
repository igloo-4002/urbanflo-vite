import { Group, Rect } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';

import { highlightColor } from '~/colors';
import { Node, useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelected';

interface IntersectionProps {
  node: Node;
}

export function Intersection({ node }: IntersectionProps) {
  const network = useNetworkStore();
  const selector = useSelector();

  const isSelected = selector.selected === node.id;
  const size = 50;

  function handleIntersectionClick(event: KonvaEventObject<MouseEvent>) {
    event.cancelBubble = true;

    // if nothing is selected, then select this node
    if (selector.selected === null) {
      selector.select(node.id);
    }
    // if this node is selected, then deselect this node
    else if (selector.selected === node.id) {
      selector.deselect();
    }
    // if another node is selected, then draw an edge
    else if (
      selector.selected !== node.id &&
      network.nodes[selector.selected]
    ) {
      network.drawEdge(
        network.nodes[selector.selected],
        network.nodes[node.id],
      );
      selector.deselect();
    } else {
      selector.select(node.id);
    }
  }

  return (
    <Group onClick={handleIntersectionClick}>
      <Rect
        x={node.x - size / 2}
        y={node.y - size / 2}
        width={size}
        height={size}
        fill="grey"
        stroke={isSelected ? highlightColor : 'transparent'}
        strokeWidth={4}
        zIndex={1}
      />
    </Group>
  );
}

import { Circle, Group } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';

import { getAllEdgeIdsForNode } from '~/helpers/zustand/NetworkStoreHelpers';
import { Node } from '~/types/Network';
import { LabelNames } from '~/types/Toolbar';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelected';
import { useToolbarStore } from '~/zustand/useToolbar';

import { laneWidth } from './Road';

interface IntersectionProps {
  node: Node;
}

export function Intersection({ node }: IntersectionProps) {
  const network = useNetworkStore();
  const selector = useSelector();
  const toolbarState = useToolbarStore();

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
      network.nodes[selector.selected] &&
      [LabelNames.Road, LabelNames.Intersection].includes(
        // @ts-expect-error - Typescript things we are trying to assign, but really we are checking if it exists in the array
        toolbarState.selectedToolBarItem,
      )
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

  const edgeIds = getAllEdgeIdsForNode(node.id, network.edges);

  // Compute total width based on maximum number of lanes from all edges
  let intersectionSize = 0;
  for (const edgeId of edgeIds) {
    const edge = network.edges[edgeId];
    intersectionSize = Math.max(intersectionSize, edge.numLanes * laneWidth);
  }

  return (
    <Group onClick={handleIntersectionClick}>
      <Circle x={node.x} y={node.y} width={4} height={4} fill="green" />
      {/* <Rect
        x={node.x - size / 2}
        y={node.y - size / 2}
        width={size}
        height={size}
        fill="grey"
        stroke={isSelected ? highlightColor : 'transparent'}
        strokeWidth={4}
        zIndex={1}
        draggable
        onDragEnd={handleDragMove}
      /> */}
    </Group>
  );
}

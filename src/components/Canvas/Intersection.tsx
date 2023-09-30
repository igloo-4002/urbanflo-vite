import { useMemo, useState } from 'react';
import { Group, Rect } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';

import { highlightColor } from '~/colors';
import { getAllEdgeIdsForNode } from '~/helpers/zustand/NetworkStoreHelpers';
import { Node } from '~/types/Network';
import { LabelNames } from '~/types/Toolbar';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelected';
import { useToolbarStore } from '~/zustand/useToolbar';

import { CanvasTooltip } from './CanvasTooltip';
import { laneWidth } from './Constats/Road';

interface IntersectionProps {
  node: Node;
}

export function Intersection({ node }: IntersectionProps) {
  const network = useNetworkStore();
  const selector = useSelector();
  const toolbarState = useToolbarStore();

  const isSelected = selector.selected === node.id;
  const baseIntersectionSize = 25;

  const [showIntersectionTooltip, setShowIntersectionTooltip] = useState(false);

  function toggleTooltip() {
    setShowIntersectionTooltip(!showIntersectionTooltip);
  }

  function handleDragMove(event: KonvaEventObject<DragEvent>) {
    const updatedNode = {
      ...network.nodes[node.id],
      x: event.target.x(),
      y: event.target.y(),
    };

    network.updateNode(node.id, updatedNode);
  }

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
  const size = useMemo(() => {
    if (edgeIds.length === 0) {
      return baseIntersectionSize;
    }

    const widths: number[] = [];

    for (const edgeId of edgeIds) {
      const flippedEdgeId = `${edgeId.split('_').reverse().join('_')}`;
      const isBidirectional = edgeIds.includes(flippedEdgeId);

      let width = network.edges[edgeId].numLanes * laneWidth;

      if (isBidirectional) {
        width += network.edges[flippedEdgeId].numLanes * laneWidth;
      }

      widths.push(width);
    }

    return Math.max(...widths);
  }, [edgeIds]);

  const tooltipText = `Type: ${node.type}`;

  return (
    <Group
      onClick={handleIntersectionClick}
      onMouseEnter={toggleTooltip}
      onMouseLeave={toggleTooltip}
    >
      <Rect
        x={node.x - size / 2}
        y={node.y - size / 2}
        width={size}
        height={size}
        fill="grey"
        stroke={isSelected ? highlightColor : 'transparent'}
        strokeWidth={4}
        draggable
        onDragEnd={handleDragMove}
      />
      <CanvasTooltip
        text={tooltipText}
        visible={showIntersectionTooltip}
        x={node.x - size / 2 + 12}
        y={node.y - size / 2 - 12}
      />
    </Group>
  );
}

import { Arrow, Circle, Layer, Stage } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';
import { v4 } from 'uuid';

import { type Node, useNetworkStore } from './zustand/useNetworkStore';
import { useSelector } from './zustand/useSelected';

/**
 * Interface modes
 *  - clicking on blank space creates a node
 *  - clicking on node selects node
 *  - clicking on edge selects edge
 *
 *  - on node select:
 *      - clicking on another node draws an edge
 *      - clicking on blank space or edge deselects node
 *      - offer to delete node
 */

function selectNodes(
  nodes: Node[],
  { x, y }: { x: number; y: number },
): Node[] {
  return nodes.filter(node => {
    const dist = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
    return dist < 32;
  });
}

export default function App() {
  const selector = useSelector();
  const network = useNetworkStore();
  const nodes = Object.values(network.nodes);
  const edges = Object.values(network.edges);

  async function onClick(event: KonvaEventObject<MouseEvent>) {
    if (selector.selected === null) {
      const selectedNodes = selectNodes(nodes, {
        x: event.evt.clientX,
        y: event.evt.clientY,
      });

      if (selectedNodes.length > 0) {
        selector.select(selectedNodes[0].id);
      } else {
        network.addNode({
          id: v4(),
          x: event.evt.clientX,
          y: event.evt.clientY,
          type: 'priority',
        });
      }
    } else if (network.nodes[selector.selected]) {
      const selectedNodes = selectNodes(nodes, {
        x: event.evt.clientX,
        y: event.evt.clientY,
      });

      if (selectedNodes.length > 0) {
        // TODO: add edge from selected to selectedNodes[0]
        const from = network.nodes[selector.selected];
        const to = selectedNodes[0];
        network.drawEdge(from, to);
        selector.deselect();
      } else {
        selector.deselect();
      }
    } else if (network.edges[selector.selected]) {
      console.log(`edge ${selector.selected} selected`);
    } else {
      throw new Error('Unknown selection');
    }
  }

  return (
    <div className="h-screen w-screen items-center justify-center flex">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={onClick}
      >
        <Layer>
          {nodes.map((node, index) => {
            return (
              <Circle
                key={index}
                x={node.x}
                y={node.y}
                fill={node.id === selector.selected ? 'blue' : 'red'}
                width={32}
                height={32}
              />
            );
          })}
        </Layer>
        <Layer>
          {edges.map((edge, index) => {
            const from = network.nodes[edge.from];
            const to = network.nodes[edge.to];

            return (
              <Arrow
                key={index}
                x={from.x}
                y={from.y}
                points={[0, 0, to.x - from.x, to.y - from.y]}
                pointerLength={10}
                pointerWidth={10}
                fill="black"
                stroke="black"
                strokeWidth={2}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

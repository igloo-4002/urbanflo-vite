import { Arrow, Circle, Layer, Stage } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';
import { v4 } from 'uuid';

import { useNetworkStore } from './zustand/useNetworkStore';
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

export default function App() {
  const selector = useSelector();
  const network = useNetworkStore();
  const nodes = Object.values(network.nodes);
  const edges = Object.values(network.edges);

  async function onClick(event: KonvaEventObject<MouseEvent>) {
    if (selector.selected === null) {
      const result = network.addNode({
        id: v4(),
        x: event.evt.clientX,
        y: event.evt.clientY,
        type: 'priority',
      });

      if (result.status === 'error') {
        console.error(result.error);
      }
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
                fill={'red'}
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

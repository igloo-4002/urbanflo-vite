import { useState } from 'react';
import { Arrow, Circle, Layer, Stage } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';
import { v4 as uuidv4 } from 'uuid';

import { useNetworkStore } from './zustand/useNetworkStore';

/**
 * Interface modes
 *  - select
 *    - can draw edge by selecting two nodes
 *    - can delete node by selecting node
 *    - can delete edge by selecting edge
 *  - place node
 */

export default function App() {
  const [mode, setMode] = useState<'node' | 'edge'>('node');

  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const network = useNetworkStore();
  // console.log(network);

  const nodes = Object.values(network.nodes);
  const edges = Object.values(network.edges);

  async function onClick(event: KonvaEventObject<MouseEvent>) {
    if (mode === 'node') {
      network.addNode({
        id: uuidv4(),
        x: event.evt.clientX,
        y: event.evt.clientY,
        type: 'priority',
      });
    } else if (mode === 'edge') {
      if (!selectedNode) {
        // select a node if one hasn't been selected yet
        const node = nodes.find(node => {
          const distance = Math.sqrt(
            Math.pow(node.x - event.evt.clientX, 2) +
              Math.pow(node.y - event.evt.clientY, 2),
          );
          return distance < 32;
        });
        node && setSelectedNode(node.id);
      } else {
        // draw an edge from the selected node to the clicked node
        const from = network.nodes[selectedNode];
        const to = nodes.find(node => {
          const distance = Math.sqrt(
            Math.pow(node.x - event.evt.clientX, 2) +
              Math.pow(node.y - event.evt.clientY, 2),
          );
          return distance < 32;
        });
        if (to) {
          network.drawEdge(from, to);
          setSelectedNode(null);
        }
      }
    } else {
      const never: never = mode;
      return never;
    }
  }

  function toggleMode() {
    setMode(mode => (mode === 'node' ? 'edge' : 'node'));
  }

  function ModeToggle() {
    return (
      <div
        className="absolute top-16 right-16 items-center justify-center rounded-full flex p-4 z-10 w-32"
        style={{ backgroundColor: mode === 'node' ? 'red' : 'black' }}
      >
        <button
          onClick={toggleMode}
          className="text-white font-sans font-medium"
        >
          {mode.toUpperCase()}
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen items-center justify-center flex">
      <ModeToggle />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={onClick}
      >
        <Layer>
          {nodes.map((node, index) => {
            const fill = selectedNode === node.id ? 'blue' : 'red';

            return (
              <Circle
                key={index}
                x={node.x}
                y={node.y}
                fill={fill}
                width={16}
                height={16}
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

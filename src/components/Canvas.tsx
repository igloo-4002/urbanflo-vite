/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Circle, Layer, Stage } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';
import { v4 } from 'uuid';

import { useSimulation } from '~/hooks/useSimulation';
import {
  SIMULATION_DATA_TOPIC,
  SIMULATION_DESTINATION_PATH,
  SIMULATION_ERROR_TOPIC,
  SIMULATION_SOCKET_URL,
} from '~/simulation-urls';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { usePlaying } from '~/zustand/usePlaying';
import { useSelector } from '~/zustand/useSelected';
import { Road } from './Road';

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

export function Canvas() {
  const selector = useSelector();
  const network = useNetworkStore();
  const { isPlaying } = usePlaying();
  const nodes = Object.values(network.nodes);
  const edges = Object.values(network.edges);

  const { subscribe, publish, isConnected, deactivate } = useSimulation({
    brokerURL: SIMULATION_SOCKET_URL,
  });

  useEffect(() => {
    return deactivate;
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCommandDelete = (e.metaKey || e.ctrlKey) && e.key === 'Backspace';
      const isEsc = e.key === 'Escape';

      if (isCommandDelete && selector.selected) {
        if (network.nodes[selector.selected]) {
          network.deleteNode(selector.selected);
          selector.deselect();
        } else if (network.edges[selector.selected]) {
          network.deleteEdge(selector.selected);
          selector.deselect();
        } else {
          throw new Error("cannot delete selected because it doesn't exist");
        }
      }

      if (isEsc && selector.selected) {
        selector.deselect();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selector, network]);

  useEffect(() => {
    if (isPlaying && isConnected) {
      console.warn('Subscribing to simulation data');

      subscribe(SIMULATION_DATA_TOPIC, message => {
        console.log(message);
      });
      subscribe(SIMULATION_ERROR_TOPIC, message => {
        console.error(message);
      });

      publish(SIMULATION_DESTINATION_PATH, { status: 'START' });
    } else if (!isPlaying && isConnected) {
      console.warn('Unsubscribing from simulation data');
      publish(SIMULATION_DESTINATION_PATH, { status: 'STOP' });
    }
  }, [isPlaying]);

  return (
    <div className="h-screen w-screen items-center justify-center flex">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={(event: KonvaEventObject<MouseEvent>) => {
          const point = { x: event.evt.clientX, y: event.evt.clientY };

          // add new node when
          // 1. there is nothing selected; AND
          // 2. there is no node at the clicked point 32 euclidean distance

          const conflict = nodes.find(node => {
            const distance = Math.sqrt(
              (node.x - point.x) ** 2 + (node.y - point.y) ** 2,
            );

            return distance < 32;
          });

          if (conflict === undefined) {
            const newNode = {
              id: v4(),
              x: point.x,
              y: point.y,
              type: 'priority',
            };
            network.addNode(newNode);
            // if another node is selected, then draw an edge
            if (
              selector.selected !== null &&
              network.nodes[selector.selected]
            ) {
              network.drawEdge(network.nodes[selector.selected], newNode);
              selector.deselect();
            }
          }
        }}
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
                onClick={() => {
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
                }}
              />
            );
          })}
        </Layer>
        <Layer>
          {edges.map((edge, index) => {
            return <Road edge={edge} key={index} />;
          })}
        </Layer>
      </Stage>
    </div>
  );
}

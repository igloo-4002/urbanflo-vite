/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Stage } from 'react-konva';

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

import { GridLayer } from './Layers/GridLayer';
import { IntersectionsLayer } from './Layers/IntersectionsLayer';
import { RoadsLayer } from './Layers/RoadsLayer';

export function Canvas() {
  const selector = useSelector();
  const network = useNetworkStore();
  const { isPlaying } = usePlaying();
  const nodes = Object.values(network.nodes);

  const { subscribe, publish, isConnected, deactivate } = useSimulation({
    brokerURL: SIMULATION_SOCKET_URL,
  });

  // Keyboard shortcuts
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

  // Streaming of simulation data
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

  // Cleanup on unmount
  useEffect(() => {
    return deactivate;
  }, []);

  function onStageClick(event: KonvaEventObject<MouseEvent>) {
    event.cancelBubble = true;

    const point = { x: event.evt.clientX, y: event.evt.clientY };

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
      if (selector.selected !== null && network.nodes[selector.selected]) {
        network.drawEdge(network.nodes[selector.selected], newNode);
        selector.deselect();
      }
    }
  }
  const [stage, setStage] = useState({ x: 0, y: 0 });

  return (
    <div className="h-screen w-screen items-center justify-center flex">
      <Stage
        x={stage.x}
        y={stage.y}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={onStageClick}
        draggable
        onWheel={e => {
          // Prevent default to disable natural scrolling
          e.evt.preventDefault();

          const MIN_SCALE = 2;
          const MAX_SCALE = 1 / MIN_SCALE;

          // Determine the scale change based on the wheel event delta
          const scaleBy = 1.05;
          const oldScale = e.currentTarget.scaleX();
          const newScale =
            e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

          // Prevent zooming out too far
          if (newScale < MAX_SCALE || newScale > MIN_SCALE) {
            return;
          }

          // const pointer = e.currentTarget.getPointerPosition();
          const pointer = { x: e.evt.clientX, y: e.evt.clientY };

          // Calculate new position to center the zooming around the cursor
          const mx = pointer.x / oldScale - e.currentTarget.x() / oldScale;
          const my = pointer.y / oldScale - e.currentTarget.y() / oldScale;

          const newX = -(mx - pointer.x / newScale) * newScale;
          const newY = -(my - pointer.y / newScale) * newScale;

          e.currentTarget.scale({ x: newScale, y: newScale });
          e.currentTarget.position({ x: newX, y: newY });
        }}
        onDragEnd={e => {
          setStage(e.currentTarget.position());
        }}
      >
        <GridLayer disabled={false} />
        <RoadsLayer />
        <IntersectionsLayer />
      </Stage>
    </div>
  );
}

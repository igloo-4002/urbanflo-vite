/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Stage } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';

import { extractCarsFromSumoMessage } from '~/helpers/sumo';
import { useSimulation } from '~/hooks/useSimulation';
import { createId } from '~/id';
import {
  BASE_SIMULATION_DATA_TOPIC,
  BASE_SIMULATION_DESTINATION_PATH,
  BASE_SIMULATION_ERROR_TOPIC,
  SIMULATION_SOCKET_URL,
} from '~/simulation-urls';
import { LabelNames } from '~/types/Toolbar';
import { useCarsStore } from '~/zustand/useCarStore';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { usePlaying } from '~/zustand/usePlaying';
import { useSelector } from '~/zustand/useSelected';
import { useStageState } from '~/zustand/useStage';
import { useToolbarStore } from '~/zustand/useToolbar';

import { CarLayer } from './Layers/CarLayer';
import { IntersectionsLayer } from './Layers/IntersectionsLayer';
import { RoadsLayer } from './Layers/RoadsLayer';

export function Canvas() {
  const selector = useSelector();
  const network = useNetworkStore();
  const player = usePlaying();
  const carStore = useCarsStore();
  const nodes = Object.values(network.nodes);
  const toolbarState = useToolbarStore();

  const { subscribe, publish, isConnected } = useSimulation({
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
    const SIMULATION_DATA_TOPIC = `${BASE_SIMULATION_DATA_TOPIC}/${player.simulationId}`;
    const SIMULATION_ERROR_TOPIC = BASE_SIMULATION_ERROR_TOPIC.replace(
      '_',
      player.simulationId ?? '',
    );
    const SIMULATION_DESTINATION_PATH = `${BASE_SIMULATION_DESTINATION_PATH}/${player.simulationId}`;

    if (player.isPlaying && isConnected) {
      console.warn('Subscribing to simulation data');

      subscribe(SIMULATION_DATA_TOPIC, message => {
        const data = extractCarsFromSumoMessage(message);

        if (data) {
          carStore.setCars(data);
        }
      });
      subscribe(SIMULATION_ERROR_TOPIC, message => {
        console.error(message);
      });

      publish(SIMULATION_DESTINATION_PATH, { status: 'START' });
    } else if (!player.isPlaying && isConnected) {
      console.warn('Unsubscribing from simulation data');
      publish(SIMULATION_DESTINATION_PATH, { status: 'STOP' });
    } else if (!player.isPlaying && player.simulationId) {
      player.changeSimulationId(null);
    }
  }, [player.isPlaying]);

  function onStageClick(event: KonvaEventObject<MouseEvent>) {
    event.cancelBubble = true;

    if (
      ![LabelNames.Road, LabelNames.Intersection].includes(
        // @ts-expect-error - Typescript things we are trying to assign, but really we are checking if it exists in the array
        toolbarState.selectedToolBarItem,
      )
    ) {
      return;
    }

    const point = event.currentTarget.getRelativePointerPosition();

    const conflict = nodes.find(node => {
      const distance = Math.sqrt(
        (node.x - point.x) ** 2 + (node.y - point.y) ** 2,
      );

      return distance < 32;
    });

    if (conflict === undefined) {
      const newNode = {
        id: createId(),
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

  const { position, ref: stageRef, setPosition, setScale } = useStageState();

  return (
    <Stage
      ref={stageRef}
      x={position.x}
      y={position.y}
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={onStageClick}
      draggable
      onDragMove={e => {
        setPosition(e.currentTarget.position());
      }}
      onWheel={e => {
        // Prevent default to disable natural scrolling
        e.evt.preventDefault();

        const MIN_SCALE = 2;
        const MAX_SCALE = 1 / MIN_SCALE;
        const SCALE_FACTOR = 1.05;

        // Determine the scale change based on the wheel event delta
        const oldScale = e.currentTarget.scaleX();
        const newScale =
          e.evt.deltaY < 0 ? oldScale * SCALE_FACTOR : oldScale / SCALE_FACTOR;

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
        setScale({ x: newScale, y: newScale });
      }}
    >
      <RoadsLayer />
      <IntersectionsLayer />
      <CarLayer />
    </Stage>
  );
}

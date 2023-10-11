import { useEffect } from 'react';
import { Stage } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';

import { toolbarItemToDecoration } from '~/helpers/decorationTypes';
import { createId } from '~/id';
import { NodeType } from '~/types/Network';
import { LabelNames } from '~/types/Toolbar';
import { useDecorationStore } from '~/zustand/useDecorations';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelected';
import {
  MAX_SCALE,
  MIN_SCALE,
  SCALE_FACTOR,
  useStageState,
} from '~/zustand/useStage';
import { useToolbarStore } from '~/zustand/useToolbar';
import { useUndoStore } from '~/zustand/useUndoStore';

import { CarLayer } from './Layers/CarLayer';
import { DecorationsLayer } from './Layers/DecorationsLayer';
import { IntersectionsLayer } from './Layers/IntersectionsLayer';
import { RoadsLayer } from './Layers/RoadsLayer';
import useJsonDownloader from "~/hooks/useJsonDownloader.ts";
import { handleDownloadEvent } from "~/helpers/zustand/NetworkStoreHelpers.ts";

export function Canvas() {
  const selector = useSelector();
  const network = useNetworkStore();
  const nodes = Object.values(network.nodes);
  const toolbarState = useToolbarStore();
  const undoStore = useUndoStore();
  const decorationsStore = useDecorationStore();
  const downloadJson = useJsonDownloader();

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isCommandDelete = (e.metaKey && e.key === 'Backspace') || e.key === 'Delete';
      const isEsc = e.key === 'Escape';
      const isSave = (e.metaKey || e.ctrlKey) && e.key === 's';

      if (isSave) {
        e.preventDefault(); // override browser's save page dialog
        handleDownloadEvent(downloadJson, network);
      }

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

      const isUndoCommand =
        (e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z';
      const isRedoCommand =
        (e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z';

      if (isUndoCommand) {
        undoStore.undo();
      }
      if (isRedoCommand) {
        undoStore.redo();
      }

      if (isEsc && selector.selected) {
        selector.deselect();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selector, network]);

  function onStageClick(event: KonvaEventObject<MouseEvent>) {
    event.cancelBubble = true;

    if (
      [LabelNames.Tree, LabelNames.Building].includes(
        // @ts-expect-error - Typescript thinks we are trying to assign, but really we are checking if it exists in the array
        toolbarState.selectedToolBarItem,
      )
    ) {
      if (!toolbarState.selectedToolBarItem) {
        return;
      }

      const point = event.currentTarget.getRelativePointerPosition();

      const decorationType = toolbarItemToDecoration(
        toolbarState.selectedToolBarItem,
      );

      const newNode = {
        id: createId(),
        x: point.x,
        y: point.y,
        type: decorationType,
      };

      decorationsStore.addItem(newNode);
      return;
    }

    if (
      ![LabelNames.Road, LabelNames.Intersection].includes(
        // @ts-expect-error - Typescript thinks we are trying to assign, but really we are checking if it exists in the array
        toolbarState.selectedToolBarItem,
      )
    ) {
      // deselect anything if clicked on the canvas
      if (selector.selected !== null) {
        selector.deselect();
      }
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
        type: NodeType.priority,
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

        // Determine the scale change based on the wheel event delta
        const oldScale = e.currentTarget.scaleX();
        const newScale =
          e.evt.deltaY < 0 ? oldScale * SCALE_FACTOR : oldScale / SCALE_FACTOR;

        // Prevent zooming out too far
        if (newScale < MAX_SCALE || newScale > MIN_SCALE) {
          return;
        }

        const pointer = { x: e.evt.clientX, y: e.evt.clientY };

        // Calculate new position to center the zooming around the cursor
        const mx = pointer.x / oldScale - e.currentTarget.x() / oldScale;
        const my = pointer.y / oldScale - e.currentTarget.y() / oldScale;

        const newX = -(mx - pointer.x / newScale) * newScale;
        const newY = -(my - pointer.y / newScale) * newScale;

        setScale({ x: newScale, y: newScale });
        setPosition({ x: newX, y: newY });
      }}
    >
      <RoadsLayer />
      <IntersectionsLayer />
      {/* <ConnectionsLayer /> */}
      <CarLayer />
      <DecorationsLayer />
    </Stage>
  );
}

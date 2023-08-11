import { Layer, Stage } from 'react-konva';

import Konva from 'konva';

import { createNewCanvasItem } from '~/context/utils/canvas';
import { useAppState } from '~/hooks/useAppState';

import { renderCanvasItems } from './CanvasItems/util';

export function Canvas() {
  const { appState, setAppState } = useAppState();

  function handleStageClick(event: Konva.KonvaEventObject<MouseEvent>) {
    if (appState.canvasState.canvasItems.length !== 0) {
      return;
    }

    if (!appState.canvasState.graph.isEmpty()) {
      return;
    }

    // Canvas is empty and click occured with a toolbar item selected, add the first ever element
    if (appState.toolBarState.selectedToolBarItem !== null) {
      const x = event.evt.clientX;
      const y = event.evt.clientY;
      const itemType = appState.toolBarState.selectedToolBarItem;

      createNewCanvasItem({ x, y, itemType, appState, setAppState });
    }
  }

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={handleStageClick}
    >
      <Layer>{renderCanvasItems(appState.canvasState.canvasItems)}</Layer>
    </Stage>
  );
}

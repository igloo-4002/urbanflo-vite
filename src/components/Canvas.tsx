import { Layer, Stage } from 'react-konva';

import { useAppState } from '~/hooks/useAppState';

import { renderCanvasItems } from './CanvasItems/util';

export function Canvas() {
  const { appState } = useAppState();

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>{renderCanvasItems(appState.canvasState.canvasItems)}</Layer>
    </Stage>
  );
}

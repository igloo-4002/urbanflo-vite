import { Layer, Line } from 'react-konva';

import { useStageState } from '~/zustand/useStage';

type RenderGridProps = {
  width: number;
  height: number;
  size: number;
};

export function GridLayer() {
  const { position, scale } = useStageState();

  function renderGrid({ width, height, size }: RenderGridProps) {
    const lines = [];

    const xOffset = position.x % size;
    const yOffset = position.y % size;

    const adjustedSize = size * scale.x;
    const strokeWidth = 1 / scale.x;
    const extraRender = adjustedSize * 5; // you can adjust this to ensure lines are visible further beyond visible area

    // Generate vertical lines
    for (
      let i = xOffset - extraRender;
      i < width + extraRender;
      i += adjustedSize
    ) {
      lines.push(
        <Line
          key={`v${i}`}
          points={[i, -extraRender, i, height + extraRender]}
          stroke="gray"
          strokeWidth={strokeWidth}
        />,
      );
    }

    // Generate horizontal lines
    for (
      let j = yOffset - extraRender;
      j < height + extraRender;
      j += adjustedSize
    ) {
      lines.push(
        <Line
          key={`h${j}`}
          points={[-extraRender, j, width + extraRender, j]}
          stroke="gray"
          strokeWidth={strokeWidth}
        />,
      );
    }

    return <>{lines}</>;
  }

  return (
    <Layer>
      {renderGrid({
        width: window.innerWidth,
        height: window.innerHeight,
        size: 100,
      })}
    </Layer>
  );
}

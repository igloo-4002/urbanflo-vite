import { Layer, Line } from 'react-konva';

function renderGrid({ width, height }: RenderGridProps) {
  const sizeX = 100;
  const sizeY = 100;

  const lines = [];
  for (let i = 0; i < width; i += sizeX) {
    lines.push(
      <Line
        key={`v${i}`}
        points={[i, 0, i, height]}
        stroke="gray"
        strokeWidth={1}
      />,
    );
  }

  for (let j = 0; j < height; j += sizeY) {
    lines.push(
      <Line
        key={`h${j}`}
        points={[0, j, width, j]}
        stroke="gray"
        strokeWidth={1}
      />,
    );
  }

  return <>{lines}</>;
}

type RenderGridProps = {
  width: number;
  height: number;
  size: number;
};

export function GridLayer() {
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

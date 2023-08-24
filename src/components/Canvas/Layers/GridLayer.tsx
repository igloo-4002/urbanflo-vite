import { Layer, Line } from 'react-konva';

type RenderGridProps = {
  width: number;
  height: number;
  size: number;
};

function renderGrid({ width, height, size }: RenderGridProps) {
  const lines = [];

  // Generate vertical lines
  for (let i = 0; i <= width; i += size) {
    lines.push(
      <Line
        key={`v${i}`}
        points={[i, 0, i, height]}
        stroke="gray"
        strokeWidth={1}
      />,
    );
  }

  // Generate horizontal lines
  for (let j = 0; j <= height; j += size) {
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

type Props = {
  disabled?: boolean;
};

export function GridLayer({ disabled = true }: Props) {
  if (disabled) {
    return <></>;
  } else {
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
}

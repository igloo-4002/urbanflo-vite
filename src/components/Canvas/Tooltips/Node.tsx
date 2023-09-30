import { Group, Rect, Text } from 'react-konva';

interface NodeTooltipProps {
  text: string;
  x: number;
  y: number;
  visible: boolean;
}

export function NodeTooltip({ text, x, y, visible }: NodeTooltipProps) {
  if (!visible) {
    return null;
  }

  const paddingX = 12;
  const paddingY = 8;
  const textWidth = text.length * 7;
  const textHeight = 16;

  return (
    <Group x={x} y={y}>
      <Rect
        width={textWidth + 2 * paddingX}
        height={textHeight + 2 * paddingY}
        fill="rgb(51, 65, 85)"
        cornerRadius={8}
        opacity={0.8}
        shadowColor="black"
        shadowBlur={5}
        shadowOffsetX={2}
        shadowOffsetY={2}
        shadowOpacity={0.3}
      />
      <Text
        text={text}
        fill="white"
        fontSize={14}
        fontStyle="normal"
        padding={paddingY}
        align="center"
        verticalAlign="middle"
        width={textWidth + 2 * paddingX}
        height={textHeight + 2 * paddingY}
      />
    </Group>
  );
}

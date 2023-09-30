import { Group, Rect, Text } from 'react-konva';

import { Edge } from '~/types/Network';

interface RoadTooltipProps {
  edge: Edge;
  x: number;
  y: number;
  visible: boolean;
}

export function RoadTooltip({ edge, x, y, visible }: RoadTooltipProps) {
  if (!visible) {
    return null;
  }

  const paddingX = 8;
  const paddingY = 8;
  const textHeight = 16;

  const roadProperties = [
    edge.name,
    `Lanes: ${edge.numLanes}`,
    `Speed: ${Math.floor(edge.speed * 3.6)} km/hr`,
    `Priority: ${edge.priority}`,
  ];

  const textWidth = roadProperties.reduce(
    (max, text) => Math.max(max, text.length),
    0,
  );

  const containerHeight =
    (textHeight + paddingY) * roadProperties.length + 2 * paddingY;

  return (
    <Group x={x} y={y}>
      <Rect
        width={(textWidth + 2) * paddingX}
        height={containerHeight}
        fill="rgb(51, 65, 85)"
        cornerRadius={8}
        opacity={0.8}
        shadowColor="black"
        shadowBlur={5}
        shadowOffsetX={2}
        shadowOffsetY={2}
        shadowOpacity={0.3}
      />
      {roadProperties.map((text, index) => (
        <Text
          key={index}
          text={text}
          fill="white"
          fontSize={index === 0 ? 16 : 14}
          fontStyle={index === 0 ? 'bold' : 'normal'}
          padding={paddingY}
          height={textHeight + paddingY}
          y={index * (textHeight + paddingY)}
        />
      ))}
    </Group>
  );
}

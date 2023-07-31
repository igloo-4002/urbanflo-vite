import React from "react";
import { Circle, Layer, Line, Stage } from "react-konva";

const MAP_RATIO = 2; // This ratio is used to scale the network to fit the canvas size

function mapCoordinates(
  x: number,
  y: number,
  canvasWidth = window.innerWidth,
  canvasHeight = window.innerHeight,
) {
  return {
    x: x * MAP_RATIO + canvasWidth / 2,
    y: y * MAP_RATIO + canvasHeight / 2, // Multiply by -1 because y increases downwards in Konva
  };
}

export default function Canvas({
  x,
  y,
  color,
}: {
  x: number;
  y: number;
  color: string;
}) {
  const nodes = [
    { id: "south", x: 0.0, y: -100.0 },
    { id: "north", x: 0.0, y: 100.0 },
    { id: "east", x: 100.0, y: 0.0 },
    { id: "center", x: 0.0, y: 0.0 },
  ];

  const edges = [
    { id: "center_south", from: "center", to: "south" },
    { id: "center_north", from: "center", to: "north" },
    { id: "east_center", from: "east", to: "center" },
  ];

  const getNodeById = (id: string) => nodes.find((node) => node.id === id);

  const redDotCoordinates = mapCoordinates(x, y);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {edges.map((edge) => {
          const fromNode = getNodeById(edge.from);
          const toNode = getNodeById(edge.to);

          if (!fromNode || !toNode) throw new Error("Invalid edge");

          const fromCoordinates = mapCoordinates(fromNode.x, fromNode.y);
          const toCoordinates = mapCoordinates(toNode.x, toNode.y);

          return (
            <Line
              key={edge.id}
              points={[
                fromCoordinates.x,
                fromCoordinates.y,
                toCoordinates.x,
                toCoordinates.y,
              ]}
              stroke="black"
              strokeWidth={20} // Adjust for lane width
            />
          );
        })}

        {nodes.map((node) => {
          const coordinates = mapCoordinates(node.x, node.y);

          return (
            <Circle
              key={node.id}
              x={coordinates.x}
              y={coordinates.y}
              radius={10} // Adjust for visual clarity
              fill="green"
            />
          );
        })}

        <Circle
          x={redDotCoordinates.x}
          y={redDotCoordinates.y}
          radius={10} // Adjust for visibility
          fill={color}
        />
      </Layer>
    </Stage>
  );
}

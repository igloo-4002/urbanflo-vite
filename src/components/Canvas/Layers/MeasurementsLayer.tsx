import React from 'react';
import { Layer, Line, Text } from 'react-konva';
import { Circle } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';

import { Point } from '~/types/Network';
import { PointType, useMeasurements } from '~/zustand/useMeasurement';

function DraggableAnchor({
  x,
  y,
  onDragMove,
}: {
  x: number;
  y: number;
  onDragMove: (e: KonvaEventObject<DragEvent>) => void;
}) {
  return (
    <Circle
      x={x}
      y={y}
      radius={5}
      fill="white"
      stroke="black"
      strokeWidth={1}
      draggable
      onDragMove={onDragMove}
    />
  );
}

export function MeasurementsLayer() {
  const measurements = useMeasurements();
  const flowMeasurements = Object.values(measurements.flowMeasurements);

  // Function to handle drag of the anchors
  function handleDragMove(
    index: number,
    position: Point,
    pointType: PointType,
  ) {
    // Update the measurements.flowMeasurements array with the new position here
    // Depending on how you've structured your state management with Zustand

    const flowMeasurement = flowMeasurements[index];
    if (flowMeasurement) {
      measurements.updateFlowMeasurementPoint(
        flowMeasurement.id,
        pointType,
        position,
      );
    }
  }

  return (
    <Layer>
      {flowMeasurements.map((flowMeasurement, index) => {
        const midX = (flowMeasurement.A.x + flowMeasurement.B.x) / 2;
        const midY = (flowMeasurement.A.y + flowMeasurement.B.y) / 2;

        return (
          <React.Fragment key={index}>
            <Line
              points={[
                flowMeasurement.A.x,
                flowMeasurement.A.y,
                flowMeasurement.B.x,
                flowMeasurement.B.y,
              ]}
              stroke="red"
              strokeWidth={2}
            />

            {/* Display text bubble */}
            <Text
              x={midX}
              y={midY}
              text={`${flowMeasurement.current}/${flowMeasurement.interval}`}
              fontSize={12}
              padding={4}
              fill="white"
              stroke="black"
              strokeWidth={1}
              background="rgba(0, 0, 0, 0.5)"
              offsetX={
                (flowMeasurement.current.toString().length +
                  flowMeasurement.interval.toString().length +
                  1) *
                3
              }
            />
            <DraggableAnchor
              x={flowMeasurement.A.x}
              y={flowMeasurement.A.y}
              onDragMove={e => {
                handleDragMove(
                  index,
                  { x: e.target.x(), y: e.target.y() },
                  'A',
                );
              }}
            />
            <DraggableAnchor
              x={flowMeasurement.B.x}
              y={flowMeasurement.B.y}
              onDragMove={e => {
                handleDragMove(
                  index,
                  { x: e.target.x(), y: e.target.y() },
                  'B',
                );
              }}
            />
          </React.Fragment>
        );
      })}
    </Layer>
  );
}

import { Fragment } from 'react';
import { Arrow, Circle, Group, Text } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';

import { centerlineColor, highlightColor, roadColor } from '~/colors';
import { getEdgeTerminals } from '~/helpers/zustand/NetworkStoreHelpers';
import { Edge } from '~/types/Network';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelector';

import { laneWidth } from './Constats/Road';

interface RoadProps {
  edge: Edge;
  offset?: number;
}

export function Road({ edge, offset = 0 }: RoadProps) {
  const network = useNetworkStore();
  const selector = useSelector();

  const isSelected = selector.selected === edge.id;

  const from = network.nodes[edge.from];
  const to = network.nodes[edge.to];

  function handleRoadClick(event: KonvaEventObject<MouseEvent>) {
    event.cancelBubble = true;
    if (selector.selected !== edge.id) {
      selector.select(edge.id);
    } else if (selector.selected === edge.id) {
      selector.deselect();
    }
  }

  const roadVector = [to.x - from.x, to.y - from.y];

  const commonProps = {
    points: [0, 0, roadVector[0], roadVector[1]],
    pointerLength: 0,
    pointerWidth: 0,
  };

  const angleRad = Math.atan2(to.y - from.y, to.x - from.x);
  const angleDeg = (angleRad * 180) / Math.PI;

  const commonOffset = {
    offsetX: offset * Math.sin(angleRad),
    offsetY: -offset * Math.cos(angleRad),
  };

  // Calculate the offset in both x and y directions
  const dx = laneWidth * Math.sin(angleRad);
  const dy = laneWidth * Math.cos(angleRad);

  // Calculate the mid-point of the lane
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  // get trailing and leading points for drawing connections for each edge
  const { leading: fromControlPoints, trailing: toControlPoints } =
    getEdgeTerminals(edge);

  function getConnectionsState() {
    if (selector.selected === null) {
      return false;
    }

    const selectedEdge = network.edges[selector.selected];

    if (selectedEdge) {
      return selectedEdge.to === edge.from;
    }

    return false;
  }

  const showFromControlPoints = isSelected;
  const showToControlPoints = getConnectionsState();

  return (
    <Group onClick={handleRoadClick}>
      {/* Highlight for selected road */}
      <Arrow
        key={`road-selected-stroke-${edge.id}`}
        x={from.x}
        y={from.y}
        stroke={highlightColor}
        strokeWidth={laneWidth * edge.numLanes + 8}
        visible={isSelected}
        {...commonProps}
        {...commonOffset}
      />

      {/* Grey Road */}
      <Arrow
        key={`road-${edge.id}`}
        x={from.x}
        y={from.y}
        fill={roadColor}
        stroke={roadColor}
        strokeWidth={laneWidth * edge.numLanes}
        {...commonProps}
        {...commonOffset}
      />

      {/* Lanes */}
      {Array.from({ length: edge.numLanes - 1 }).map((_, index) => {
        const offset = index + 0.5 - (edge.numLanes - 1) / 2;

        return (
          <Arrow
            key={`centerline-${edge.id}-${index}`}
            x={from.x + offset * dx}
            y={from.y - offset * dy}
            dash={[10, 10]}
            fill="transparent"
            stroke={centerlineColor}
            strokeWidth={2}
            {...commonProps}
            {...commonOffset}
          />
        );
      })}

      {/* Arrow for traffic direction */}
      {Array.from({ length: edge.numLanes }).map((_, index) => {
        const yOffset =
          index * laneWidth - (edge.numLanes - 1) * (laneWidth / 2);

        // Calculating rotated offset
        const offsetX = midX + yOffset * Math.sin(angleRad);
        const offsetY = midY - yOffset * Math.cos(angleRad);

        return (
          <Arrow
            key={`arrow-${edge.id}-${index}`}
            x={offsetX}
            y={offsetY}
            points={[0, 0, 20 * Math.cos(angleRad), 20 * Math.sin(angleRad)]}
            pointerLength={10}
            pointerWidth={10}
            fill="white"
            stroke="white"
            strokeWidth={2}
            angle={angleDeg}
            {...commonOffset}
          />
        );
      })}

      {/* Show lane numbers for selected road and connected edges if not selected */}
      {Array.from({ length: edge.numLanes }).map((_, index) => {
        const offset = index - (edge.numLanes - 1) / 2;

        const trailingPosition = 0.25; // 25%
        const leadingPosition = 0.75; // 70%

        const xTrailing =
          (1 - trailingPosition) * from.x +
          trailingPosition * to.x +
          offset * dx;
        const yTrailing =
          (1 - trailingPosition) * from.y +
          trailingPosition * to.y -
          offset * dy;

        const xLeading =
          (1 - leadingPosition) * from.x + leadingPosition * to.x + offset * dx;
        const yLeading =
          (1 - leadingPosition) * from.y + leadingPosition * to.y - offset * dy;

        const fontSize = 11;
        const verticalOffset = fontSize / 2;

        // sumo always counts lane number from the rightmost side of the road regardless of orientation
        const angleDeg = (angleRad * 180) / Math.PI;
        const shouldReverse = angleDeg >= 0 && angleDeg <= 180;
        const laneNumber = shouldReverse ? edge.numLanes - index : index + 1;

        return (
          <Fragment key={index}>
            {/* show lane numbers in trailing position */}
            <Text
              key={`road-label-${edge.id}-${index}-trailing`}
              x={xTrailing - verticalOffset}
              y={yTrailing - verticalOffset}
              text={`L${laneNumber}`}
              fontSize={fontSize}
              fill="white"
              visible={showToControlPoints}
            />

            {/* show lane numbers in leading position */}
            <Text
              key={`road-label-${edge.id}-${index}-leading`}
              x={xLeading - verticalOffset}
              y={yLeading - verticalOffset}
              text={`L${laneNumber}`}
              fontSize={fontSize}
              fill="white"
              visible={isSelected}
            />
          </Fragment>
        );
      })}

      {/* Show connection control points */}
      {fromControlPoints.map((point, index) => {
        return (
          <Circle
            key={index}
            x={point.x}
            y={point.y}
            radius={4}
            fill="red"
            visible={showFromControlPoints}
            onClick={e => {
              e.cancelBubble = true; // stops event propagation
              console.log('clicked from edge');
            }}
          />
        );
      })}

      {/* show possible connections points for edges connected to non-selected edges */}
      {toControlPoints.map((point, index) => {
        return (
          <Circle
            key={index}
            x={point.x}
            y={point.y}
            radius={4}
            fill="red"
            visible={showToControlPoints}
            onClick={e => {
              e.cancelBubble = true;
              console.log('draw connection to here');
            }}
          />
        );
      })}
    </Group>
  );
}

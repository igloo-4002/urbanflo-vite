import { Fragment, useState } from 'react';
import { Arrow, Circle, Group, Text } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';
import { Vector2d } from 'konva/lib/types';

import { centerlineColor, highlightColor, roadColor } from '~/colors';
import {
  getEdgeTerminals,
  isEntitySelected,
} from '~/helpers/zustand/NetworkStoreHelpers';
import { Edge } from '~/types/Network';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelector';

import { laneWidth } from './Constants/Road';
import { RoadTooltip } from './Tooltips/Road';

interface RoadProps {
  edge: Edge;
  offset?: number;
}

export function Road({ edge, offset = 0 }: RoadProps) {
  const network = useNetworkStore();
  const selector = useSelector();

  const [showRoadTooltip, setShowRoadTooltip] = useState(false);

  const isSelected = isEntitySelected(edge.id);

  const from = network.nodes[edge.from];
  const to = network.nodes[edge.to];

  function toggleRoadTooltip() {
    setShowRoadTooltip(!showRoadTooltip);
  }

  function handleRoadClick(event: KonvaEventObject<MouseEvent>) {
    event.cancelBubble = true;
    if (!isSelected) {
      selector.select({ type: 'edge', id: edge.id });
    } else {
      selector.deselect();
    }
  }

  const roadVector: Vector2d = {
    x: to.x - from.x,
    y: to.y - from.y,
  };

  const commonProps = {
    points: [0, 0, roadVector.x, roadVector.y],
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

  function isToControlPointsVisible() {
    if (selector.selected === null) {
      return false;
    }

    if (selector.selected.type === 'connection-control') {
      const selectedEdge = network.edges[selector.selected.id.split('-')[0]];
      return selectedEdge.to === edge.from;
    }

    const selectedEdge = network.edges[selector.selected.id];

    if (selectedEdge) {
      return selectedEdge.to === edge.from;
    }

    return false;
  }

  function getLaneIndex(index: number) {
    // sumo always counts lane number from the rightmost side of the road regardless of orientation
    const isBelowXAxis = (from.y + to.y) / 2 < 0;
    return isBelowXAxis ? index : edge.numLanes - index - 1;
  }

  function handleControlPointClick(
    e: KonvaEventObject<MouseEvent>,
    id: string,
  ) {
    e.cancelBubble = true;

    if (selector.selected === null) {
      return;
    }

    // we have another control point already selected
    if (selector.selected.type === 'connection-control') {
      // if the selected control point is clicked again
      if (selector.selected.id === id) {
        selector.deselect();
      }
      // do not draw connection if its the same edge
      else if (selector.selected.id.split('-')[0] === id.split('-')[0]) {
        // do nothing
      }
      // draw connection if its another edge
      else {
        network.addConnection({
          from: selector.selected.id.split('-')[0],
          to: id.split('-')[0],
          fromLane: parseInt(selector.selected.id.split('-')[2]),
          toLane: parseInt(id.split('-')[2]),
        });
        selector.deselect();
      }
    } else {
      selector.select({ type: 'connection-control', id });
    }
  }

  const showFromControlPoints =
    isSelected || selector.selected?.type === 'connection-control';
  const showToControlPoints = isToControlPointsVisible();

  const isTooltipVisible =
    showRoadTooltip && !isSelected && selector.selected === null;

  return (
    <Group
      onClick={handleRoadClick}
      onMouseEnter={toggleRoadTooltip}
      onMouseLeave={toggleRoadTooltip}
    >
      {/* Highlight for selected road */}
      <Arrow
        key={`road-selected-${edge.id}`}
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
            key={`road-centerline-${edge.id}-${index}`}
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
            key={`road-arrow-${edge.id}-${index}`}
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

        const laneNumber = getLaneIndex(index) + 1;

        return (
          <Fragment key={index}>
            {/* show lane numbers in trailing position */}
            <Text
              key={`road-label-${edge.id}-${laneNumber}-trailing`}
              x={xTrailing - verticalOffset}
              y={yTrailing - verticalOffset}
              text={`L${laneNumber}`}
              fontSize={fontSize}
              fill="white"
              visible={showToControlPoints}
            />

            {/* show lane numbers in leading position */}
            <Text
              key={`road-label-${edge.id}-${laneNumber}-leading`}
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
        const laneIndex = edge.numLanes - getLaneIndex(index) - 1;
        const controlPointId = `${edge.id}-lane-${laneIndex}`;

        const isSelected = isEntitySelected(controlPointId);

        return (
          <Circle
            key={controlPointId}
            x={point.x}
            y={point.y}
            radius={4}
            fill="red"
            visible={showFromControlPoints}
            onClick={e => {
              handleControlPointClick(e, controlPointId);
            }}
            stroke={isSelected ? highlightColor : 'transparent'}
          />
        );
      })}

      {/* show possible connections points for edges connected to non-selected edges */}
      {toControlPoints.map((point, index) => {
        const laneIndex = edge.numLanes - getLaneIndex(index) - 1;
        const controlPointId = `${edge.id}-lane-${laneIndex}`;

        return (
          <Circle
            key={controlPointId}
            x={point.x}
            y={point.y}
            radius={4}
            fill="red"
            visible={showToControlPoints}
            onClick={e => {
              handleControlPointClick(e, controlPointId);
            }}
          />
        );
      })}
      <RoadTooltip
        edge={edge}
        x={midX + 10}
        y={midY + 10}
        visible={isTooltipVisible}
      />
    </Group>
  );
}

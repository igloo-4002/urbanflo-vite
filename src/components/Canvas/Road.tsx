import React from 'react';
import { useState } from 'react';
import { Arrow, Group } from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';

import { centerlineColor, highlightColor, roadColor } from '~/colors';
import { Edge } from '~/types/Network';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelected';

import { laneWidth } from './Constants/Road';
import { RoadTooltip } from './Tooltips/Road';

interface RoadProps {
  edge: Edge;
  offset?: number;
}

function RoadComponent({ edge, offset = 0 }: RoadProps) {
  const network = useNetworkStore();
  const selector = useSelector();

  const [showRoadTooltip, setShowRoadTooltip] = useState(false);

  const isSelected = selector.selected === edge.id;

  const from = network.nodes[edge.from];
  const to = network.nodes[edge.to];

  function toggleRoadTooltip() {
    setShowRoadTooltip(!showRoadTooltip);
  }

  function handleRoadClick(event: KonvaEventObject<MouseEvent>) {
    event.cancelBubble = true;
    if (selector.selected !== edge.id) {
      selector.select(edge.id);
    } else if (selector.selected === edge.id) {
      selector.deselect();
    }
  }

  const commonProps = {
    points: [0, 0, to.x - from.x, to.y - from.y],
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

  const isTooltipVisible = showRoadTooltip && !isSelected;

  return (
    <Group
      onClick={handleRoadClick}
      onMouseEnter={toggleRoadTooltip}
      onMouseLeave={toggleRoadTooltip}
    >
      {/* Highlight for selected road */}
      <Arrow
        key={`road-selected-stroke-${edge.id}`}
        x={from.x}
        y={from.y}
        stroke={isSelected ? highlightColor : 'transparent'}
        strokeWidth={laneWidth * edge.numLanes + 8}
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
      <RoadTooltip
        edge={edge}
        x={midX + 10}
        y={midY + 10}
        visible={isTooltipVisible}
      />
    </Group>
  );
}

export const Road = React.memo(RoadComponent);

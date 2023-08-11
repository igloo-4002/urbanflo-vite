import { useEffect, useState } from 'react';
import { Image } from 'react-konva';

import roadImageHorizontal from '~/assets/roadHorizontal.png';
import roadImageVertical from '~/assets/roadVertical.png';
import {
  ModalViewNames,
  RoadDirections,
  type RoadFields,
} from '~/context/types';
import { updateSelectedItem } from '~/context/utils/modal';
import { useAppState } from '~/hooks/useAppState';

import { type CanvasItemProps } from './types';

export interface RoadProps {
  roadFields: RoadFields;
  canvasProps: CanvasItemProps;
}

export function Road(props: RoadProps) {
  const { appState, setAppState } = useAppState();

  const canvasProps: CanvasItemProps = props.canvasProps;
  const roadFields: RoadFields = props.roadFields;

  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const isHorizontal =
    roadFields.direction === RoadDirections.LEFT ||
    roadFields.direction === RoadDirections.RIGHT;

  const horizontalWidth = 250;
  const horizontalHeight = 100;

  const verticalWidth = horizontalHeight;
  const verticalHeight = horizontalWidth;

  useEffect(() => {
    const img = new window.Image();
    img.src = isHorizontal ? roadImageHorizontal : roadImageVertical;
    img.width = isHorizontal ? horizontalWidth : verticalWidth;
    img.height = isHorizontal ? horizontalHeight : verticalHeight;
    img.onload = () => {
      setImage(img);
    };
  }, [isHorizontal, roadFields.direction, verticalHeight, verticalWidth]);

  function handleClick() {
    if (appState.toolBarState.selectedToolBarItem === null) {
      updateSelectedItem({
        index: canvasProps.index,
        viewName: ModalViewNames.ROAD_PROPERTIES_EDITOR,
        appState,
        setAppState,
      });
    }
  }

  return image ? (
    <Image
      alt={'road'}
      key={canvasProps.index}
      image={image}
      x={canvasProps.x}
      y={canvasProps.y}
      draggable={false}
      onClick={handleClick}
    />
  ) : null;
}

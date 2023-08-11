import { useEffect, useState } from 'react';
import { Image } from 'react-konva';

import intersectionImage from '~/assets/roadIntersection.jpeg';
import { type IntersectionFields, ModalViewNames } from '~/context/types';
import { updateSelectedItem } from '~/context/utils/modal';
import { useAppState } from '~/hooks/useAppState';

import { type CanvasItemProps } from './types';

export interface IntersectionProps {
  intersectionProps: IntersectionFields;
  canvasProps: CanvasItemProps;
}

export function Intersection(props: IntersectionProps) {
  const canvasProps: CanvasItemProps = props.canvasProps;
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const { appState, setAppState } = useAppState();

  useEffect(() => {
    const img = new window.Image();
    img.src = intersectionImage;
    img.width = 250;
    img.height = 250;
    img.onload = () => {
      setImage(img);
    };
  }, []);

  function handleClick() {
    if (appState.toolBarState.selectedToolBarItem === null) {
      updateSelectedItem({
        index: canvasProps.index,
        viewName: ModalViewNames.INTERSECTION_PROPERTIES_EDITOR,
        appState,
        setAppState,
      });
    }
  }

  return image ? (
    <Image
      alt={'intersection'}
      key={canvasProps.index}
      image={image}
      x={canvasProps.x}
      y={canvasProps.y}
      onClick={handleClick}
    />
  ) : null;
}

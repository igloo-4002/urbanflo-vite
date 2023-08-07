import { useEffect, useState } from 'react';
import { Image } from 'react-konva';

import intersectionImage from '~/assets/roadIntersection.jpeg';
import { type IntersectionFields } from '~/context/types';

import { type CanvasItemProps } from './types';

export interface IntersectionProps {
  intersectionProps: IntersectionFields;
  canvasProps: CanvasItemProps;
}

export function Intersection(props: IntersectionProps) {
  const canvasProps: CanvasItemProps = props.canvasProps;
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = intersectionImage;
    img.width = 250;
    img.height = 250;
    img.onload = () => {
      setImage(img);
    };
  }, []);

  function handleClick() {}

  return image ? (
    <Image
      alt={'intersection'}
      key={canvasProps.index}
      image={image}
      x={canvasProps.x}
      y={canvasProps.y}
      draggable={canvasProps.draggable}
      offsetX={canvasProps.offsetX}
      offsetY={canvasProps.offsetY}
      onClick={handleClick}
    />
  ) : null;
}

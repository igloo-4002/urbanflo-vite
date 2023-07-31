import { useEffect, useState } from "react";
import { Image } from "react-konva";

import intersectionImage from "../../assets/intersection.png";
import { type IntersectionFields } from "../../context/types";
import { type CanvasItemProps } from "./types";

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
    img.height = 100;
    img.onload = () => {
      setImage(img);
    };
  }, []);

  return image ? (
    <Image
      alt={"intersection"}
      key={canvasProps.index}
      image={image}
      x={canvasProps.x}
      y={canvasProps.y}
      draggable
      offsetX={canvasProps.offsetX}
      offsetY={canvasProps.offsetY}
    />
  ) : null;
}

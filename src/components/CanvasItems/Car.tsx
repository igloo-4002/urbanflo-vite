import { useEffect, useState } from "react";
import { Image } from "react-konva";

import carImage from "../../assets/car.png";
import { type CarFields } from "../../context/types";
import { type CanvasItemProps } from "./types";

export interface CarProps {
  canvasProps: CanvasItemProps;
  carFields: CarFields;
}

export function Car(props: CarProps) {
  const canvasProps: CanvasItemProps = props.canvasProps;
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = carImage;
    img.width = 50;
    img.height = 125;
    img.onload = () => {
      setImage(img);
    };
  }, []);

  return image ? (
    <Image
      alt={"car"}
      key={canvasProps.index}
      image={image}
      x={canvasProps.x}
      y={canvasProps.y}
      draggable={false}
      offsetX={canvasProps.offsetX}
      offsetY={canvasProps.offsetY}
    />
  ) : null;
}

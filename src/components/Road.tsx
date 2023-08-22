import { useEffect, useState } from 'react';
import { Image } from 'react-konva';

import { useSelector } from '~/zustand/useSelected';

import { Edge, useNetworkStore } from '../zustand/useNetworkStore';

type RoadProps = Edge;

// https://chat.openai.com/c/1adcf0c5-0efc-4f2f-8536-8b653aa1acc8
const roadSvgString = `<svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
<rect x="0" y="35" width="400" height="30" fill="grey" />
<line x1="0" y1="50" x2="400" y2="50" stroke="white" stroke-width="2" stroke-dasharray="10,10"/>
</svg>`;

function loadSvgStringAsImage(
  svgString: string,
  callback: (image: HTMLImageElement) => void,
): void {
  const img = new window.Image();
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  img.onload = function () {
    callback(img);
    URL.revokeObjectURL(url);
  };

  img.src = url;
}

export function Road(props: RoadProps) {
  const [roadImage, setRoadImage] = useState<HTMLImageElement | null>(null);

  const network = useNetworkStore();
  const selector = useSelector();

  const from = network.nodes[props.from];
  const to = network.nodes[props.to];

  useEffect(() => {
    loadSvgStringAsImage(roadSvgString, image => {
      setRoadImage(image);
    });
  }, []);

  function handleRoadClick() {
    if (selector.selected !== props.id) {
      selector.select(props.id);
    } else if (selector.selected === props.id) {
      selector.deselect();
    }
  }

  return (
    <>{roadImage && <Image image={roadImage} onClick={handleRoadClick} />}</>
  );
}

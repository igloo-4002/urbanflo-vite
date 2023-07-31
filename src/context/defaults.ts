import { createId } from "@paralleldrive/cuid2";

import { CanvasItemType, type AppState, type Car, type Road } from "./types";
import { ToolBarItemProps as ToolBarItem } from '~/components/ToolBar/ToolBarItem';

import roadIcon from '../../public/road-icon.png'
import intersectionIcon from '../../public/intersection.png'

export const getDefaultAppState: () => AppState = () => {
  const road1: Road = {
    id: createId(),
    info: {
      type: CanvasItemType.ROAD,
    },
    props: {
      image: new window.Image(),
      x: 500,
      y: 500,
      draggable: true,
      offsetX: 50,
      offsetY: 50,
    },
    speedLimit: 60,
    lanes: 1,
    length: 200,
    direction: "up",
  };

  const road2: Road = {
    id: createId(),
    info: {
      type: CanvasItemType.ROAD,
    },
    props: {
      image: new window.Image(),
      x: 420,
      y: 420,
      draggable: true,
      offsetX: 50,
      offsetY: 50,
    },
    speedLimit: 40,
    lanes: 1,
    length: 150,
    direction: "left",
  };

  const car: Car = {
    id: createId(),
    info: {
      type: CanvasItemType.CAR,
    },
    props: {
      image: new window.Image(),
      x: 500,
      y: 750,
      draggable: true,
      offsetX: 25,
      offsetY: 62.5,
    },
    speed: 0,
    direction: "vertical",
  };

  const toolBarItems: ToolBarItem[] = [
    {
      src: roadIcon,
      alt: "Road",
      onClick: () => console.log('road icon clicked'),
    },
    {
      src: intersectionIcon,
      alt: "Intersection",
      onClick: () => console.log('intersection icon clicked'),
    }
  ];

  return {
    projectInfo: {
      name: "untitled",
    },
    canvasState: {
      canvasItems: [road1, road2, car],
      selectedCanvasItem: null,
      isPlaying: false,
    },
    projectState: {
      isSaved: true, // when a user creates a project, it is saved by default
    },
    leftSideBarState: {
      isOpen: false,
      viewName: null,
    },
    toolBarState: {
      isOpen: true,
      items: toolBarItems,
    }
  };
};

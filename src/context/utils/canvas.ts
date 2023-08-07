import { Dispatch, SetStateAction } from 'react';

import { createId } from '@paralleldrive/cuid2';

import {
  AppState,
  CanvasItem,
  CanvasItemTypes,
  Car,
  Intersection,
  Road,
  RoadDirections,
  ToolBarItemOptions,
} from '../types';

interface createNewCanvasItemArgs {
  x: number;
  y: number;
  itemType: ToolBarItemOptions;
  appState: AppState;
  setAppState: Dispatch<SetStateAction<AppState>>;
}

export function createNewCanvasItem(args: createNewCanvasItemArgs) {
  const baseCanvasItem: CanvasItem = {
    id: createId(),
    props: {
      x: args.x,
      y: args.y,
      image: new window.Image(),
    },
    info: {
      type: args.itemType,
    },
  };

  let itemToAdd: CanvasItemTypes;

  switch (args.itemType) {
    case 'road': {
      const roadItem: Road = {
        ...baseCanvasItem,
        graphInfo: baseRoadGraphInfo,
        speedLimit: 60,
        lanes: 2,
        length: 100,
        direction: RoadDirections.UP,
      };
      args.appState.canvasState.graph.addNode(roadItem);
      itemToAdd = roadItem;
      break;
    }
    case 'car': {
      const carItem: Car = {
        ...baseCanvasItem,
        speed: 50,
        direction: 'horizontal',
      };
      itemToAdd = carItem;
      break;
    }
    case 'intersection': {
      const intersectionItem: Intersection = {
        ...baseCanvasItem,
        graphInfo: baseIntersectionGraphInfo,
        connectingRoads: [],
      };
      args.appState.canvasState.graph.addNode(intersectionItem);
      itemToAdd = intersectionItem;
      break;
    }
    default:
      return;
  }

  args.setAppState({
    ...args.appState,
    canvasState: {
      ...args.appState.canvasState,
      canvasItems: [...args.appState.canvasState.canvasItems, itemToAdd],
      graph: args.appState.canvasState.graph,
    },
    toolBarState: {
      ...args.appState.toolBarState,
      selectedToolBarItem: null,
    },
  });
}

const baseRoadGraphInfo = {
  exits: {},
  maxExits: 1,
};

const baseIntersectionGraphInfo = {
  exits: {},
  maxExits: 4,
};

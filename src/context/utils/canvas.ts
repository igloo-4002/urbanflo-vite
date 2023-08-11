import { Dispatch, SetStateAction } from 'react';

import { createId } from '@paralleldrive/cuid2';

import { isGraphItem } from '~/components/CanvasItems/util';

import {
  AppState,
  CanvasItem,
  CanvasItemType,
  CanvasItemTypes,
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
    case CanvasItemType.ROAD: {
      itemToAdd = {
        ...baseCanvasItem,
        graphInfo: baseRoadGraphInfo,
        speedLimit: 60,
        lanes: 2,
        length: 100,
        direction: RoadDirections.UP,
      };
      break;
    }
    case CanvasItemType.CAR: {
      itemToAdd = {
        ...baseCanvasItem,
        speed: 50,
        direction: 'horizontal',
      };
      break;
    }
    case CanvasItemType.INTERSECTION: {
      itemToAdd = {
        ...baseCanvasItem,
        graphInfo: baseIntersectionGraphInfo,
        connectingRoads: [],
      };
      break;
    }
    default:
      return;
  }

  if (isGraphItem(itemToAdd)) {
    args.appState.canvasState.graph.addNode(itemToAdd);
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

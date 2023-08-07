import { ToolBarItemProps as ToolBarItem } from '~/components/ToolBar/ToolBarItem';
import { TrafficGraph } from '~/graph';

export const CanvasItemType = {
  ROAD: 'road',
  CAR: 'car',
  TRAFFIC_LIGHT: 'traffic-light',
} as const;

export const ModalViewNames = {
  ROAD_PROPERTIES_EDITOR: 'road-properties-editor',
  INTERSECTION_PROPERTIES_EDITOR: 'intersection-properties-editor',
} as const;

/**
 * Usage of `RoadDirections` is as follows:
 * If a direction is specified, then the direction of road travel would be towards that direction.
 *
 * For example, RoadDirections.UP would mean that the road is travelling from bottom to top.
 */
export const RoadDirections = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export interface CanvasItem {
  id: string;
  info: {
    type: string;
  };
  props: {
    image: HTMLImageElement;
    x: number;
    y: number;
    draggable: boolean;
    offsetX: number;
    offsetY: number;
  };
  graphInfo?: GraphInfo;
}

export interface GraphInfo {
  exits: { [key: number]: Road | Intersection };
  maxExits: number;
}

export interface RoadFields {
  speedLimit: number;
  lanes: number;
  length: number;
  direction: string;
}

export type Road = Required<CanvasItem> & RoadFields;

export interface CarFields {
  speed: number;
  direction: 'horizontal' | 'vertical';
}

export type Car = CanvasItem & CarFields;

export interface IntersectionFields {
  connectingRoads: number[];
}

export type Intersection = Required<CanvasItem> & IntersectionFields;

export type CanvasItemTypes = Road | Car | Intersection;

export type GraphItem = Road | Intersection;

export type AppState = {
  projectInfo: {
    name: string; // Normal Project settings, e.g. name, description, etc.
  };
  canvasState: {
    canvasItems: CanvasItemTypes[]; // Roads, Cars, traffic lights, etc.
    graph: TrafficGraph;
    selectedCanvasItem: CanvasItemTypes | null;
    isPlaying: boolean;
  };
  projectState: {
    isSaved: boolean;
  };
  leftSideBarState: {
    viewName: string | null;
    isOpen: boolean;
  };
  toolBarState: {
    isOpen: boolean;
    items: ToolBarItem[];
  };
};

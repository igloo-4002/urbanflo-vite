export const CanvasItemType = {
  ROAD: "road",
  CAR: "car",
  TRAFFIC_LIGHT: "traffic-light",
} as const;

export const ModalViewNames = {
  ROAD_PROPERTIES_EDITOR: "road-properties-editor",
  INTERSECTION_PROPERTIES_EDITOR: "intersection-properties-editor",
} as const;

/**
 * Usage of `RoadDirections` is as follows:
 * If a direction is specified, then the direction of road travel would be towards that direction.
 *
 * For example, RoadDirections.UP would mean that the road is travelling from bottom to top.
 */
export const RoadDirections = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
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
}

export interface RoadFields {
  speedLimit: number;
  lanes: number;
  length: number;
  direction: string;
}

export type Road = CanvasItem & RoadFields;

export interface CarFields {
  speed: number;
  direction: "horizontal" | "vertical";
}

export type Car = CanvasItem & CarFields;

export interface IntersectionFields {
  connectingRoads: number[];
}

export type Intersection = IntersectionFields & CanvasItem;

export type CanvasItemTypes = Road | Car | Intersection;

export type AppState = {
  projectInfo: {
    name: string; // Normal Project settings, e.g. name, description, etc.
  };
  canvasState: {
    canvasItems: CanvasItemTypes[]; // Roads, Cars, traffic lights, etc.
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
};

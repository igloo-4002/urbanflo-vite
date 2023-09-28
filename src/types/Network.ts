export type Point = {
  x: number;
  y: number;
};

export type Vector2D = {
  x: number;
  y: number;
};

export const NodeType = {
  priority: 'priority',
  traffic_light: 'traffic_light',
  right_before_left: 'right_before_left',
  left_before_right: 'left_before_right',
  unregulated: 'unregulated',
  priority_stop: 'priority_stop',
  traffic_light_unregulated: 'traffic_light_unregulated',
  allway_stop: 'allway_stop',
  rail_signal: 'rail_signal',
  zipper: 'zipper',
  traffic_light_right_on_red: 'traffic_light_right_on_red',
  rail_crossing: 'rail_crossing',
  dead_end: 'dead_end',
} as const;

export type Node = {
  id: string;
  x: number;
  y: number;
  type: keyof typeof NodeType;
};

export type Edge = {
  id: string;
  from: string;
  to: string;
  priority: number;
  numLanes: number;
  width: number;
  speed: number;
  name: string;
  spreadType?: 'right' | 'center' | 'roadCenter';
};

export type Connection = {
  from: string;
  to: string;
  fromLane: number;
  toLane: number;
};

export type Route = {
  id: string;
  edges: string;
};

export type VType = {
  id: string;
  accel: number;
  decel: number;
  sigma: number;
  length: number;
  minGap: number;
  maxSpeed: number;
};

export type Flow = {
  id: string;
  type: string;
  route: string;
  begin: number;
  end: number;
  period: number;
};

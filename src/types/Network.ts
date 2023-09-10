export type Point = {
  x: number;
  y: number;
};

export type NodeType =
  | 'priority'
  | 'traffic_light'
  | 'right_before_left'
  | 'left_before_right'
  | 'unregulated'
  | 'priority_stop'
  | 'traffic_light_unregulated'
  | 'allway_stop'
  | 'rail_signal'
  | 'zipper'
  | 'traffic_light_right_on_red'
  | 'rail_crossing'
  | 'dead_end';

export type Node = {
  id: string;
  x: number;
  y: number;
  type: NodeType;
};

export type Edge = {
  id: string;
  from: string;
  to: string;
  priority: number;
  numLanes: number;
  width: number;
  speed: number;
  spreadType?: 'center' | 'center' | 'roadCenter';
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

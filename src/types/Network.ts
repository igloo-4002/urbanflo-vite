export type Point = {
  x: number;
  y: number;
};

export type Node = {
  id: string;
  x: number;
  y: number;
  type: string;
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

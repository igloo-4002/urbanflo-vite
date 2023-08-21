import { create } from 'zustand';

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
  speed: number;
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

// export type VType = {
//   id: string; 
//   accel: number;
//   decel: number; 
//   sigma: number;
//   length: number;
//   minGap: number; 
//   maxSpeed: number;
// };

// export type Flow = {
//   id: string;
//   type: string;
//   route: string;
//   begin: number;
//   end: number;
//   period: number;
// };

export type Network = {
  nodes: Record<string, Node>;
  edges: Record<string, Edge>;
  connections: Record<string, Connection>;
  // vType: Record<string, VType>;
  // route: Record<string, Route>;
  // flow: Record<string, Flow>;
  addNode: (node: Node) => void;
  drawEdge: (from: Node, to: Node) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  addConnection: (from: Edge, to: Edge) => void;
};

export const useNetworkStore = create<Network>(set => ({
  nodes: {},
  edges: {},
  grid: {},
  addNode: (node: Node) =>
    set(state => ({ nodes: { ...state.nodes, [node.id]: node } })),
  drawEdge: (from, to) =>
    set(state => {
      const newId = `${from.id}${to.id}`;
      const newEdge: Edge = {
        id: newId,
        from: from.id,
        to: to.id,
        priority: -1,
        numLanes: 1,
        speed: 13.89,
      };

      const pointA = { x: from.x, y: from.y };
      const pointB = { x: to.x, y: to.y };

      if (edgeDoesIntersect(state, pointA, pointB)) {
        return state;
      } else {
        return { edges: { ...state.edges, [newId]: newEdge } };
      }
    }),
  deleteNode: (id: string) => {
    set(state => {
      const newNodes = { ...state.nodes };
      delete newNodes[id];
      for (const edgeId in state.edges) {
        const edge = state.edges[edgeId];
        if (edge.from === id || edge.to === id) {
          delete state.edges[edgeId];
        }
      }
      return {
        nodes: newNodes,
      };
    });
  },
  deleteEdge: (id: string) => {
    set(state => {
      const newEdges = { ...state.edges };
      delete newEdges[id];
      return {
        edges: newEdges,
      };
    });
  },
  addConnection: (from, to) =>
    set((state) => ({
      connections: {
        ...state.connections,
        [`${from.id}${to.id}`]: {
          from: from.id,
          to: to.id,
          fromLane: 0,
          toLane: 0,
        },
      }
    }))
}));

function onSegment(p: Point, q: Point, r: Point): boolean {
  return (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  );
}

function orientation(p: Point, q: Point, r: Point): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) {
    return 0;
  } // colinear
  return val > 0 ? 1 : 2; // clockwise or counterclockwise
}

function doIntersect(A: Point, B: Point, C: Point, D: Point): boolean {
  const o1 = orientation(A, B, C);
  const o2 = orientation(A, B, D);
  const o3 = orientation(C, D, A);
  const o4 = orientation(C, D, B);

  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  // Special cases
  // A, B, and C are colinear and C lies on segment AB
  if (o1 === 0 && onSegment(A, C, B)) {
    return true;
  }

  // A, B, and D are colinear and D lies on segment AB
  if (o2 === 0 && onSegment(A, D, B)) {
    return true;
  }

  // C, D, and A are colinear and A lies on segment CD
  if (o3 === 0 && onSegment(C, A, D)) {
    return true;
  }

  // C, D, and B are colinear and B lies on segment CD
  if (o4 === 0 && onSegment(C, B, D)) {
    return true;
  }
  // Doesn't fall in any of the above cases
  return false;
}

function arePointsEqual(p1: Point, p2: Point) {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Given pointA and pointB and a line drawn between edges from C to D
 * find if the line intersects with the hypothetical line drawn between A and B
 */
function edgeDoesIntersect(network: Network, pointA: Point, pointB: Point) {
  for (const edgeId in network.edges) {
    const edge = network.edges[edgeId];

    const from = network.nodes[edge.from];
    const to = network.nodes[edge.to];

    const pointC = { x: from.x, y: from.y };
    const pointD = { x: to.x, y: to.y };

    if (
      arePointsEqual(pointA, pointC) ||
      arePointsEqual(pointA, pointD) ||
      arePointsEqual(pointB, pointC) ||
      arePointsEqual(pointB, pointD)
    ) {
      continue;
    }

    if (doIntersect(pointA, pointB, pointC, pointD)) {
      return true;
    }
  }
  return false;
}

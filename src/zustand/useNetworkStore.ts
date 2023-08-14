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

export type Network = {
  nodes: Record<string, Node>;
  edges: Record<string, Edge>;
  addNode: (node: Node) => void;
  drawEdge: (from: Node, to: Node) => void;
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

      if (edgeDoesIntersect(state, from, to)) {
        return state;
      } else {
        return { edges: { ...state.edges, [newId]: newEdge } };
      }
    }),
  /**
       * ({
      edges: {
        ...state.edges,
        [`${from.id}${to.id}`]: {
          id: `${from.id}${to.id}`,
          from: from.id,
          to: to.id,
          priority: -1,
          numLanes: 1,
          speed: 13.89,
        },
      },
    })
       */
}));

function orientation(p: Point, q: Point, r: Point): number {
  const value = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  if (value === 0) {
    return 0;
  } // colinear
  return value > 0 ? 1 : 2; // clock or counterclock wise
}

function onSegment(p: Point, q: Point, r: Point): boolean {
  return (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  );
}

function doIntersect(p1: Point, q1: Point, p2: Point, q2: Point): boolean {
  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  if (o1 === 0 && onSegment(p1, p2, q1)) {
    return true;
  }
  if (o2 === 0 && onSegment(p1, q2, q1)) {
    return true;
  }
  if (o3 === 0 && onSegment(p2, p1, q2)) {
    return true;
  }
  if (o4 === 0 && onSegment(p2, q1, q2)) {
    return true;
  }

  return false;
}

export function edgeDoesIntersect(
  network: Network,
  nodeA: Node,
  nodeB: Node,
): boolean {
  for (const edgeId in network.edges) {
    const edge = network.edges[edgeId];
    const existingFromNode = network.nodes[edge.from];
    const existingToNode = network.nodes[edge.to];

    const pointA = { x: nodeA.x, y: nodeA.y };
    const pointB = { x: nodeB.x, y: nodeB.y };

    if (doIntersect(pointA, pointB, existingFromNode, existingToNode)) {
      return true;
    }
  }

  return false;
}

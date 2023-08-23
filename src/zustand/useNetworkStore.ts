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
  vehsPerHour: number;
};

export type Network = {
  nodes: Record<string, Node>;
  edges: Record<string, Edge>;
  connections: Record<string, Connection>;
  vType: Record<string, VType>;
  route: Record<string, Route>;
  flow: Record<string, Flow>;
  addNode: (node: Node) => void;
  drawEdge: (from: Node, to: Node) => void;
  updateEdge: (edgeId: string, edge: Edge) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  addConnection: (from: Edge, to: Edge) => void;
};

export const useNetworkStore = create<Network>(set => ({
  nodes: {},
  edges: {},
  connections: {},
  vType: {},
  route: {},
  flow: {},
  grid: {},
  addNode: (node: Node) =>
    set(state => ({ nodes: { ...state.nodes, [node.id]: node } })),
  drawEdge: (from, to) =>
    set(state => {
      const newEdgeId = `${from.id}_${to.id}`;
      const newEdge: Edge = {
        id: newEdgeId,
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
        const connectionPossible = Object.values(state.edges).find(
          e => e.to === newEdge.from,
        );

        if (connectionPossible) {
          const newConnection: Connection = {
            from: newEdge.to,
            to: newEdge.from,
            fromLane: 0,
            toLane: 0,
          };

          const newRouteId = `${newEdge.to}_${newEdge.from}`;
          const newRoute: Route = {
            id: newRouteId,
            edges: `${newEdge.to} ${newEdge.from}`,
          };

          const newFlowId = `flow_${newEdge.to}${newEdge.from}`;
          const flow: Flow = {
            id: newFlowId,
            type: 'car',
            route: newRoute.id,
            begin: 0,
            end: 86400,
            period: 1,
            vehsPerHour: 3600,
          };

          return {
            edges: { ...state.edges, [newEdgeId]: newEdge },
            connections: {
              ...state.connections,
              [`${newConnection.from}_${newConnection.to}`]: newConnection,
            },
            route: { ...state.route, [newRouteId]: newRoute },
            flow: { ...state.flow, [newFlowId]: flow },
          };
        } else {
          return { edges: { ...state.edges, [newEdgeId]: newEdge } };
        }
      }
    }),
  updateEdge: (edgeId, edge) => {
    set(state => {
      return {
        edges: {
          ...state.edges,
          [edgeId]: edge,
        },
      };
    });
  },
  deleteNode: (id: string) => {
    set(state => {
      const newNodes = { ...state.nodes };
      delete newNodes[id];

      const newEdges = { ...state.edges };
      const edgesToDelete: string[] = [];
      for (const edgeId in newEdges) {
        const edge = state.edges[edgeId];
        if (edge.from === id || edge.to === id) {
          edgesToDelete.push(edgeId);
          delete state.edges[edgeId];
        }
      }

      const newConnections = { ...state.connections };
      for (const connectionId in newConnections) {
        const connection = newConnections[connectionId];
        if (
          edgesToDelete.includes(connection.from) ||
          edgesToDelete.includes(connection.to)
        ) {
          delete newConnections[connectionId];
        }
      }

      const newRoutes = { ...state.route };
      for (const routeId in newRoutes) {
        const route = state.route[routeId];
        for (const edgeId of edgesToDelete) {
          if (route.edges.includes(edgeId)) {
            delete state.route[routeId];
            break;
          }
        }
      }

      const newFlows = { ...state.flow };
      for (const flowId in newFlows) {
        const flow = newFlows[flowId];
        if (!newRoutes[flow.route]) {
          delete newFlows[flowId];
        }
      }

      return {
        nodes: newNodes,
        route: newRoutes,
        connections: newConnections,
        flow: newFlows,
        edges: newEdges,
      };
    });
  },
  deleteEdge: (id: string) => {
    set(state => {
      const newEdges = { ...state.edges };
      delete newEdges[id];

      const newConnections = { ...state.connections };
      for (const [key, connection] of Object.entries(newConnections)) {
        if (connection.from === id || connection.to === id) {
          delete newConnections[key];
        }
      }

      const newRoutes = { ...state.route };
      for (const [key, route] of Object.entries(newRoutes)) {
        if (route.edges.includes(id)) {
          delete newRoutes[key];
        }
      }

      const newFlows = { ...state.flow };
      for (const [key, flow] of Object.entries(newFlows)) {
        if (flow.route.includes(id)) {
          delete newFlows[key];
        }
      }

      return {
        edges: newEdges,
        connections: newConnections,
        route: newRoutes,
        flow: newFlows,
      };
    });
  },
  addConnection: (from, to) =>
    set(state => ({
      connections: {
        ...state.connections,
        [`${from.id}_${to.id}`]: {
          from: from.id,
          to: to.id,
          fromLane: 0,
          toLane: 0,
        },
      },
    })),
}));

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

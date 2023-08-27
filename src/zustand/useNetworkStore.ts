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
  // vehsPerHour: number;
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
  updateFlow: (flowId: string, flow: Flow) => void;
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
        const { newConnections, newRoutes, newFlows } =
          updateAssociatesOnNewEdge(
            state.edges,
            state.route,
            state.connections,
            state.flow,
            newEdge,
          );

        return {
          edges: { ...state.edges, [newEdgeId]: newEdge },
          connections: newConnections,
          flow: newFlows,
          route: newRoutes,
        };
      }
    }),
  updateEdge: (edgeId, edge) => {
    set(state => {
      const updatedEdges = {
        ...state.edges,
        [edgeId]: edge,
      };

      let connections = { ...state.connections };
      const newRoutes = { ...state.route };
      const newFlows = { ...state.flow };

      // find all the existing connections which need to be updated
      const affectedConnections = Object.values(connections).filter(
        c => c.to === edge.id || c.from === edge.id,
      );

      // update network if the number of lanes is decreasing
      if (state.edges[edgeId].numLanes > edge.numLanes) {
        for (const connection of affectedConnections) {
          // delete connections with outdated lane attributes
          if (
            connection.fromLane > edge.numLanes - 1 ||
            connection.toLane > edge.numLanes - 1
          ) {
            delete connections[
              `${connection.from}_${connection.to}_${connection.fromLane}_${connection.toLane}`
            ];
          }
        }

        return {
          edges: updatedEdges,
          connections,
        };
      }
      // update the network if the number of lanes is increasing
      else if (state.edges[edgeId].numLanes < edge.numLanes) {
        for (const connection of affectedConnections) {
          if (connection.from === edge.id) {
            const fromNumLanes = edge.numLanes;
            const toNumLanes = state.edges[connection.to].numLanes;

            connections = updateConnectionsOnLaneChange(
              connection.from,
              connection.to,
              fromNumLanes,
              toNumLanes,
              connections,
            );
          } else if (connection.to === edge.id) {
            // create new conneciton with updated toLanes
            const fromNumLanes = state.edges[connection.from].numLanes;
            const toNumLanes = edge.numLanes;
            connections = updateConnectionsOnLaneChange(
              connection.from,
              connection.to,
              fromNumLanes,
              toNumLanes,
              connections,
            );
          } else {
            continue;
          }
        }

        return {
          edges: updatedEdges,
          connections,
          flow: newFlows,
          route: newRoutes,
        };
      }
      // numLanes is unchanged
      else {
        return {
          edges: updatedEdges,
        };
      }
    });
  },
  deleteNode: (id: string) => {
    set(state => {
      const newNodes = { ...state.nodes };
      delete newNodes[id];

      const newEdges = { ...state.edges };
      const edgesToDelete = new Set<string>();
      for (const edgeId in newEdges) {
        const edge = newEdges[edgeId];
        if (edge.from === id || edge.to === id) {
          edgesToDelete.add(edgeId);
          delete newEdges[edgeId];
        }
      }

      const newConnections = removeItems(
        state.connections,
        c => edgesToDelete.has(c.from) || edgesToDelete.has(c.to),
      );

      const newRoutes = removeItems(state.route, r =>
        r.edges.split(' ').some(edge => edgesToDelete.has(edge)),
      );

      const newFlows = removeItems(state.flow, f => !newRoutes[f.route]);

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

      const newConnections = removeItems(
        state.connections,
        c => c.from === id || c.to === id,
      );

      const newRoutes = removeItems(state.route, r => r.edges.includes(id));

      const newFlows = removeItems(state.flow, f => !newRoutes[f.route]);

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
  updateFlow: (flowId, flow) =>
    set(state => ({ flow: { ...state.flow, [flowId]: flow } })),
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

function createRouteId(from: string, to: string) {
  const source = from.split('_');
  const sink = to.split('_');

  return `${source[0]}_to_${sink[1]}`;
}

// TODO: Add more data to the store so we can get O(1) retrieval of edges for a node
export function getAllEdgeIdsForNode(
  nodeId: string,
  edges: Record<string, Edge>,
): string[] {
  const edgeIds: string[] = [];

  for (const edgeId in edges) {
    if (edgeId.startsWith(nodeId) || edgeId.endsWith(nodeId)) {
      edgeIds.push(edgeId);
    }
  }

  return edgeIds;
}

function updateAssociatesOnNewEdge(
  edges: Record<string, Edge>,
  routes: Record<string, Route>,
  connections: Record<string, Connection>,
  flow: Record<string, Flow>,
  newEdge: Edge,
) {
  const newConnections = { ...connections };
  const newRoutes = { ...routes };
  const newFlows = { ...flow };

  const possibleConnections = Object.values(edges).filter(
    e => e.to === newEdge.from || e.from === newEdge.to,
  );

  /**
   *
   * connections: create a connection if the 'to' of edge 1 is the 'from' of edge 2
   * route: create a route for a connection; route.length === connection.length
   * flow: create a flow for a route; route.length === flow.length
   */
  for (const connection of possibleConnections) {
    let connectionFrom: string;
    let connectionTo: string;

    // if edge.to === newEdge.from then put edge.to in the from for the connection
    // if edge.from === newEdge.to then put edge.to in the to for the connection
    if (connection.to === newEdge.from) {
      connectionFrom = connection.id;
      connectionTo = newEdge.id;
    } else if (connection.from === newEdge.to) {
      connectionFrom = newEdge.id;
      connectionTo = connection.id;
    } else {
      continue;
    }

    const connectionKey = `${connectionFrom}_${connectionTo}_0_0`;
    if (!newConnections[connectionKey]) {
      newConnections[connectionKey] = {
        from: connectionFrom,
        to: connectionTo,
        fromLane: 0,
        toLane: 0,
      };

      const newRouteId = createRouteId(connectionFrom, connectionTo);
      newRoutes[newRouteId] = {
        id: newRouteId,
        edges: `${connectionFrom} ${connectionTo}`,
      };

      const newFlowId = `flow_${connectionFrom}${connectionTo}`;
      newFlows[newFlowId] = {
        id: newFlowId,
        type: 'car',
        route: newRouteId,
        begin: 0,
        end: 86400,
        period: 1,
        // vehsPerHour: 3600,
      };
    }
  }

  return { newConnections, newRoutes, newFlows };
}

function updateConnectionsOnLaneChange(
  from: string,
  to: string,
  fromNumLanes: number,
  toNumLanes: number,
  connections: Record<string, Connection>,
): Record<string, Connection> {
  const newConnections = { ...connections };

  for (let fromLane = 0; fromLane < fromNumLanes; fromLane++) {
    for (let toLane = 0; toLane < toNumLanes; toLane++) {
      const newConnectionId = `${from}_${to}_${fromLane}_${toLane}`;

      if (!newConnections[newConnectionId]) {
        newConnections[newConnectionId] = {
          from,
          to,
          fromLane,
          toLane,
        };
      }
    }
  }

  return newConnections;
}

function removeItems<T>(
  items: { [key: string]: T },
  condition: (item: T) => boolean,
) {
  const newItems = { ...items };
  for (const key in newItems) {
    if (condition(newItems[key])) {
      delete newItems[key];
    }
  }

  return newItems;
}

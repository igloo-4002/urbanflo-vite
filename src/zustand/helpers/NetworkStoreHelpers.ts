import {
  Connection,
  Edge,
  Flow,
  Network,
  Point,
  Route,
} from '../useNetworkStore';

/**
 * Given pointA and pointB and a line drawn between edges from C to D
 * find if the line intersects with the hypothetical line drawn between A and B
 */
export function edgeDoesIntersect(
  network: Network,
  pointA: Point,
  pointB: Point,
) {
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

export function onSegment(p: Point, q: Point, r: Point): boolean {
  return (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  );
}

export function orientation(p: Point, q: Point, r: Point): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) {
    return 0;
  } // colinear
  return val > 0 ? 1 : 2; // clockwise or counterclockwise
}

export function doIntersect(A: Point, B: Point, C: Point, D: Point): boolean {
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

export function arePointsEqual(p1: Point, p2: Point) {
  return p1.x === p2.x && p1.y === p2.y;
}

export function createRouteId(from: string, to: string) {
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

export function updateAssociatesOnNewEdge(
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

export function updateConnectionsOnLaneChange(
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

export function removeItems<T>(
  items: Record<string, T>,
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

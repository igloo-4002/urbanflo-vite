import { laneWidth } from '~/components/Canvas/Constants/Road';
import { getUrbanFloFileContents } from '~/logic/urbanflo-file-logic.ts';
import { Connection, Edge, Flow, Point, Route } from '~/types/Network';
import { Network, useNetworkStore } from '~/zustand/useNetworkStore';

/**
 * Given pointA and pointB and a line drawn between edges from C to D
 * find if the line intersects with the hypothetical line drawn between A and B

 * @param {Network} network - The network containing all edges.
 * @param {Point} pointA - The start point of the edge.
 * @param {Point} pointB - The end point of the edge.
 * @returns {boolean} - Returns true if there is an intersection, otherwise false.
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

/**
 * Checks if point q lies on the line segment formed by points p and r.
 * @param {Point} p - The starting point of the segment.
 * @param {Point} q - The point to check.
 * @param {Point} r - The ending point of the segment.
 * @returns {boolean} - Returns true if q lies on the segment, otherwise false.
 */
export function onSegment(p: Point, q: Point, r: Point): boolean {
  return (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  );
}

/**
 * Determines the orientation of an ordered triplet of points.
 * @param {Point} p - First point.
 * @param {Point} q - Second point.
 * @param {Point} r - Third point.
 * @returns {number} - Returns 0 for colinear, 1 for clockwise, and 2 for counterclockwise.
 */
export function orientation(p: Point, q: Point, r: Point): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) {
    return 0;
  } // colinear
  return val > 0 ? 1 : 2; // clockwise or counterclockwise
}

/**
 * @param {Point} A - Start point of the first segment.
 * @param {Point} B - End point of the first segment.
 * @param {Point} C - Start point of the second segment.
 * @param {Point} D - End point of the second segment.
 * @returns {boolean} - Returns true if segments intersect, otherwise false.
 */

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

/**
 * Checks if two points are equal.
 * @param {Point} p1 - The first point.
 * @param {Point} p2 - The second point.
 * @returns {boolean} - Returns true if points are equal, otherwise false.
 */
export function arePointsEqual(p1: Point, p2: Point) {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Generates a route ID based on the provided from and to strings.
 * @param {string} from - The source string.
 * @param {string} to - The sink string.
 * @returns {string} - Returns the generated route ID.
 */
export function createRouteId(from: string, to: string) {
  const source = from.split('_');
  const sink = to.split('_');

  return `${source[0]}_to_${sink[1]}`;
}

// TODO: Add more data to the store so we can get O(1) retrieval of edges for a node/**
/**
 * Retrieves all edge IDs associated with a given node.
 * @param {string} nodeId - The node's ID.
 * @param {Record<string, Edge>} edges - All edges in the network.
 * @returns {string[]} - Returns an array of edge IDs associated with the node.
 */
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

/**
 * @param {Record<string, Route>} routes - All routes in the network.
 * @param {Record<string, Connection>} connections - All connections in the network.
 * @param {Record<string, Flow>} flow - The network flow.
 * @param {Edge} newEdge - The newly added edge.
 * @returns {Object} - Returns updated connections, routes, and flows.
 */
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
        vehsPerHour: 1000,
      };
    }
  }

  return { newConnections, newRoutes, newFlows };
}

/**
 * @param {string} to - Destination edge ID.
 * @param {number} fromNumLanes - Number of lanes in the source edge.
 * @param {number} toNumLanes - Number of lanes in the destination edge.
 * @param {Record<string, Connection>} connections - All connections in the network.
 * @returns {Record<string, Connection>} - Returns updated connections.
 */
export function updateConnectionsOnLaneChange(
  from: string,
  to: string,
  fromNumLanes: number,
  toNumLanes: number,
  connections: Record<string, Connection>,
): Record<string, Connection> {
  const newConnections = { ...connections };

  for (const [key, connection] of Object.entries(newConnections)) {
    if (connection.from === from && connection.to === to) {
      delete newConnections[key];
    }
  }

  const minLanes = Math.min(fromNumLanes, toNumLanes);
  for (let lane = 0; lane < minLanes; lane++) {
    const newConnectionId = `${from}_${to}_${lane}_${lane}`;

    if (!newConnections[newConnectionId]) {
      newConnections[newConnectionId] = {
        from,
        to,
        fromLane: lane,
        toLane: lane,
      };
    }
  }

  if (fromNumLanes > minLanes) {
    for (let lane = minLanes; lane < fromNumLanes; lane++) {
      const newConnectionId = `${from}_${to}_${lane}_${minLanes - 1}`;
      newConnections[newConnectionId] = {
        from,
        to,
        fromLane: lane,
        toLane: minLanes - 1,
      };
    }
  } else if (toNumLanes > minLanes) {
    for (let lane = minLanes; lane < toNumLanes; lane++) {
      const newConnectionId = `${from}_${to}_${minLanes - 1}_${lane}`;
      newConnections[newConnectionId] = {
        from,
        to,
        fromLane: minLanes - 1,
        toLane: lane,
      };
    }
  }

  return newConnections;
}

/**
 * Removes items from a record based on a condition.
 * @template T
 * @param {Record<string, T>} items - The items to process.
 * @param {function(T): boolean} condition - The condition to test each item against.
 * @returns {Record<string, T>} - Returns the record without the removed items.
 */
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

/**
 * Determines the leading and trailing terminals for a given edge.
 * @param {Edge} edge - The edge to process.
 * @param {number} [lambdat=50] - Parameter affecting the calculation.
 * @param {number} [lambdal=50] - Parameter affecting the calculation.
 * @returns {Object} - Returns an object containing arrays of leading and trailing terminals.
 */
export function getEdgeTerminals(
  edge: Edge,
  lambdat: number = 50,
  lambdal: number = 50,
) {
  const from = useNetworkStore.getState().nodes[edge.from];
  const to = useNetworkStore.getState().nodes[edge.to];

  const { x: xt0, y: yt0 } = from;
  const { x: xl0, y: yl0 } = to;

  const m1 = (yl0 - yt0) / (xl0 - xt0);
  const m2 = (xt0 - xl0) / (yl0 - yt0);

  const angle1 = Math.atan(m1);

  const signX = xl0 > xt0 ? -1 : 1;

  const xl = xl0 + signX * lambdal * Math.cos(angle1);
  const xt = xt0 - signX * lambdat * Math.cos(angle1);

  const yl = yl0 + signX * lambdal * Math.sin(angle1);
  const yt = yt0 - signX * lambdat * Math.sin(angle1);

  const angle2 = Math.atan(m2);
  const cl = yl - m2 * xl;
  const ct = yt - m2 * xt;

  const n = edge.numLanes;
  const d = (edge.numLanes * laneWidth) / 2;

  const xta = xt - d * Math.cos(angle2) + (laneWidth / 2) * Math.cos(angle2);

  const xla = xl - d * Math.cos(angle2) + (laneWidth / 2) * Math.cos(angle2);

  // linspace from xta to xtb inclusive with n
  const xLeading = Array.from(
    { length: n },
    (_, i) => xla + i * (laneWidth * Math.cos(angle2)),
  );

  const yLeading = xLeading.map(x => m2 * x + cl);

  const xTrailing = Array.from(
    { length: n },
    (_, i) => xta + i * (laneWidth * Math.cos(angle2)),
  );

  const yTrailing = xTrailing.map(x => m2 * x + ct);

  const leading = xLeading.map((x, i) => ({ x, y: yLeading[i] }));
  const trailing = xTrailing.map((x, i) => ({ x, y: yTrailing[i] }));

  return {
    leading,
    trailing,
  };
}

/**
 * Handles the download event for the network data.
 * @param {function(string, string)} downloadJson - Function to trigger the download.
 * @param {Network} network - The network data.
 */
export function handleDownloadEvent(
  downloadJson: (jsonString: string, fileName: string) => void,
  network: Network,
) {
  const jsonString = getUrbanFloFileContents();
  downloadJson(jsonString, network.documentName);
}

/**
 * Determines if the network has any data.
 * @param {Network} network - The network to check.
 * @returns {boolean} - Returns true if the network has data, otherwise false.
 */
export function networkHasData(network: Network) {
  return [
    network.nodes,
    network.edges,
    network.route,
    network.connections,
    network.flow,
  ].some(record => Object.values(record).length > 0);
}

/**
 * Retrieves all edges associated with a given node.
 * @param {string} nodeId - The node's ID.
 * @param {Record<string, Edge>} edges - All edges in the network.
 * @returns {Edge[]} - Returns an array of edges associated with the node.
 */
export function getEdgesAssociatedWithNode(
  nodeId: string,
  edges: Record<string, Edge>,
): Edge[] {
  const edgeIds = getAllEdgeIdsForNode(nodeId, edges);

  return edgeIds.map(id => edges[id]);
}

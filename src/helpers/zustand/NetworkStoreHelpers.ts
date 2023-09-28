import { laneWidth } from '~/components/Canvas/Constats/Road';
import {
  Connection,
  Edge,
  Flow,
  Node,
  Point,
  Route,
  Vector2D,
} from '~/types/Network';
import { Network, useNetworkStore } from '~/zustand/useNetworkStore';

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

  const leading = xLeading.map<Point>((x, i) => ({ x, y: yLeading[i] }));
  const trailing = xTrailing.map<Point>((x, i) => ({ x, y: yTrailing[i] }));

  return {
    leading,
    trailing,
  };
}

type TerminatingEdge = {
  left: Point;
  right: Point;
  unitVector: Vector2D;
};

export function getTerminatingEdgesOverNode(node: Node) {
  const network = useNetworkStore.getState();
  const terminatingEdges = getAllEdgeIdsForNode(node.id, network.edges)
    .map(id => network.edges[id])
    .map(edge => {
      const A =
        edge.from === node.id
          ? network.nodes[edge.from]
          : network.nodes[edge.to];

      const B =
        edge.from === node.id
          ? network.nodes[edge.to]
          : network.nodes[edge.from];

      const vector: Vector2D = {
        x: B.x - A.x,
        y: B.y - A.y,
      };
      const magitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);

      const unitVector: Vector2D = {
        x: vector.x / magitude,
        y: vector.y / magitude,
      };

      const m = (B.y - A.y) / (B.x - A.x);
      const mOrthogonal = -1 / m;
      const angle = Math.atan(mOrthogonal);

      const width = (edge.numLanes * laneWidth) / 2;

      const left: Point = {
        x: node.x - width * Math.cos(angle),
        y: node.y - width * Math.sin(angle),
      };

      const right: Point = {
        x: node.x + width * Math.cos(angle),
        y: node.y + width * Math.sin(angle),
      };

      return { left, right, unitVector };
    });

  /**
   * Move the terminating edges away from the node until they no longer intersect
   */
  let i = 0;
  const k = 0.01;
  while (doTerminatingEdgesIntersect(terminatingEdges)) {
    const unitVector = terminatingEdges[i].unitVector;
    const deltaX = k * unitVector.x;
    const deltaY = k * unitVector.y;

    terminatingEdges[i].left.x += deltaX;
    terminatingEdges[i].left.y += deltaY;

    terminatingEdges[i].right.x += deltaX;
    terminatingEdges[i].right.y += deltaY;

    i = (i + 1) % terminatingEdges.length;
  }

  const q = 25;
  for (let i = 0; i < terminatingEdges.length; i++) {
    const deltaX = q * terminatingEdges[i].unitVector.x;
    const deltaY = q * terminatingEdges[i].unitVector.y;
    terminatingEdges[i].left.x += deltaX;
    terminatingEdges[i].left.y += deltaY;

    terminatingEdges[i].right.x += deltaX;
    terminatingEdges[i].right.y += deltaY;
  }

  sortEdgesClockwise(terminatingEdges, node);

  return terminatingEdges;
}

function doTerminatingEdgesIntersect(terminatingEdges: TerminatingEdge[]) {
  for (let i = 0; i < terminatingEdges.length; i++) {
    const edge1 = terminatingEdges[i];
    for (let j = i + 1; j < terminatingEdges.length; j++) {
      const edge2 = terminatingEdges[j];

      if (doIntersect(edge1.left, edge1.right, edge2.left, edge2.right)) {
        return true;
      }
    }
  }

  return false;
}

function findIntersection(
  { pointA, gradA }: { pointA: Point; gradA: number },
  { pointB, gradB }: { pointB: Point; gradB: number },
): Point {
  const x =
    (gradA * pointA.x - gradB * pointB.x + pointB.y - pointA.y) /
    (gradA - gradB);

  const y = gradA * (x - pointA.x) + pointA.y;

  return { x, y };
}

function sortEdgesClockwise(
  edges: TerminatingEdge[],
  center: Point,
): TerminatingEdge[] {
  return edges.sort((a, b) => {
    // Calculate midpoint for edge a
    const midA: Point = {
      x: (a.left.x + a.right.x) / 2,
      y: (a.left.y + a.right.y) / 2,
    };

    // Calculate midpoint for edge b
    const midB: Point = {
      x: (b.left.x + b.right.x) / 2,
      y: (b.left.y + b.right.y) / 2,
    };

    // Calculate angle relative to center for midA and midB
    const angleA = Math.atan2(midA.y - center.y, midA.x - center.x);
    const angleB = Math.atan2(midB.y - center.y, midB.x - center.x);

    return angleA - angleB;
  });
}

function getQuadraticBezierPoints(
  { pointA, gradA }: { pointA: Point; gradA: number },
  { pointB, gradB }: { pointB: Point; gradB: number },
) {
  const control = findIntersection({ pointA, gradA }, { pointB, gradB });

  return [
    pointA.x,
    pointA.y,
    control.x,
    control.y,
    control.x,
    control.y,
    pointB.x,
    pointB.y,
  ];
}

function generateCurve(
  i: number,
  j: number,
  terminatingEdges: TerminatingEdge[],
) {
  const terminatingEdgeA = terminatingEdges[i];
  const terminatingEdgeB = terminatingEdges[j];

  const unitVectorA = terminatingEdgeA.unitVector;
  const gradA = unitVectorA.y / unitVectorA.x;
  const pointA = terminatingEdgeA.right;

  const unitVectorB = terminatingEdgeB.unitVector;
  const gradB = unitVectorB.y / unitVectorB.x;

  const m = -1 / gradB;

  const dot = unitVectorA.x * unitVectorB.x + unitVectorA.y * unitVectorB.y;
  const cross = unitVectorA.x * unitVectorB.y - unitVectorA.y * unitVectorB.x;

  let angleRadians = Math.acos(Math.max(-1, Math.min(1, dot)));
  if (cross < 0) {
    angleRadians = 2 * Math.PI - angleRadians;
  }
  const angle = angleRadians * (180 / Math.PI);

  console.log(i, j, { angle });

  const pointB = angle < 180 ? terminatingEdgeB.left : terminatingEdgeB.right;

  return getQuadraticBezierPoints({ pointA, gradA }, { pointB, gradB });
}

export function getInterleavedBezierCurves(
  terminatingEdges: TerminatingEdge[],
) {
  if (terminatingEdges.length <= 1) {
    return [];
  }

  const curves: number[][] = [];

  for (let i = 0; i < terminatingEdges.length - 1; i++) {
    const curve = generateCurve(i, i + 1, terminatingEdges);
    curves.push(curve);
  }

  const curve = generateCurve(terminatingEdges.length - 1, 0, terminatingEdges);
  curves.push(curve);

  return curves;
}

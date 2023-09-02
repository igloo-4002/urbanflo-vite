import { create } from 'zustand';

import { Connection, Edge, Flow, Node, Route, VType } from '~/types/Network';

import {
  connectNewEdge,
  edgeDoesIntersect,
  removeItems,
  updateConnectionsOnLaneChange,
} from './helpers/NetworkStoreHelpers';

export type Network = {
  nodes: Record<string, Node>;
  edges: Record<string, Edge>;
  connections: Record<string, Connection>;
  vType: Record<string, VType>;
  route: Record<string, Route>;
  flow: Record<string, Flow>;
  addNode: (node: Node) => void;
  updateNode: (nodeID: string, node: Node) => void;
  drawEdge: (from: Node, to: Node) => void;
  updateEdge: (edgeId: string, edge: Edge) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  updateFlow: (flowId: string, flow: Flow) => void;
};

export const useNetworkStore = create<Network>(set => ({
  nodes: {},
  edges: {},
  connections: {},
  vType: {},
  route: {},
  flow: {},
  addNode: (node: Node) =>
    set(state => ({ nodes: { ...state.nodes, [node.id]: node } })),
  updateNode: (nodeId, node) => {
    set(state => {
      return {
        nodes: {
          ...state.nodes,
          [nodeId]: node,
        },
      };
    });
  },
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
        // disallow intersecting edges
        return state;
      }
      const newEdges: Record<string, Edge> = {
        ...state.edges,
        [newEdgeId]: newEdge,
      };

      const newConnections = connectNewEdge({ newEdge });

      return {
        edges: newEdges,
        connections: newConnections,
      };
    }),
  updateEdge: (edgeId, edge) => {
    set(state => {
      const updatedEdges = {
        ...state.edges,
        [edgeId]: edge,
      };

      const newRoutes = { ...state.route };
      const newFlows = { ...state.flow };

      // find all the existing connections which need to be updated
      const affectedConnections = Object.values(state.connections).filter(
        c => c.to === edge.id || c.from === edge.id,
      );

      // update connections if the number of lanes is decreasing
      if (state.edges[edgeId].numLanes > edge.numLanes) {
        // remove connections with outdated lanes
        const connections = removeItems(
          state.connections,
          c => c.fromLane > edge.numLanes - 1 || c.toLane > edge.numLanes - 1,
        );

        return {
          edges: updatedEdges,
          connections,
        };
      }
      // update connections if the number of lanes is increasing
      else if (state.edges[edgeId].numLanes < edge.numLanes) {
        let connections = { ...state.connections };
        for (const connection of affectedConnections) {
          // if the connection is 'from' the edge being updated
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
          }
          // if the connection is 'to' the edge being updated
          else if (connection.to === edge.id) {
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

      // delete edges with deleted nodes
      const newEdges = { ...state.edges };
      const edgesToDelete = new Set<string>();
      for (const edgeId in newEdges) {
        const edge = newEdges[edgeId];
        if (edge.from === id || edge.to === id) {
          edgesToDelete.add(edgeId);
          delete newEdges[edgeId];
        }
      }

      // remove connections with deleted edges
      const newConnections = removeItems(
        state.connections,
        c => edgesToDelete.has(c.from) || edgesToDelete.has(c.to),
      );

      // delete routes with deleted edges
      const newRoutes = removeItems(state.route, r =>
        r.edges.split(' ').some(edge => edgesToDelete.has(edge)),
      );

      // delete flows with deleted routes
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

      // delete connections with deleted edges
      const newConnections = removeItems(
        state.connections,
        c => c.from === id || c.to === id,
      );

      // delete routes with deleted edges
      const newRoutes = removeItems(state.route, r => r.edges.includes(id));

      // delete flows with deleted routes
      const newFlows = removeItems(state.flow, f => !newRoutes[f.route]);

      return {
        edges: newEdges,
        connections: newConnections,
        route: newRoutes,
        flow: newFlows,
      };
    });
  },
  updateFlow: (flowId, flow) =>
    set(state => ({ flow: { ...state.flow, [flowId]: flow } })),
}));

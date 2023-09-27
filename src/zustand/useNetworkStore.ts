import { create } from 'zustand';

import { laneWidth } from '~/components/Canvas/Constants/Road';
import { AddEdgeCommand } from '~/helpers/commands/AddEdgeCommand';
import { AddNodeCommand } from '~/helpers/commands/AddNodeCommand';
import { RemoveEdgeCommand } from '~/helpers/commands/RemoveEdgeCommand';
import { RemoveNodeCommand } from '~/helpers/commands/RemoveNodeCommand';
import {
  edgeDoesIntersect,
  removeItems,
  updateAssociatesOnNewEdge,
  updateConnectionsOnLaneChange,
} from '~/helpers/zustand/NetworkStoreHelpers';
import { Connection, Edge, Flow, Node, Route, VType } from '~/types/Network';

import { useUndoStore } from './useUndoStore';

export const DEFAULT_ROAD_NAME = 'New Road';

export interface NetworkData {
  documentName: string;
  nodes: Record<string, Node>;
  edges: Record<string, Edge>;
  connections: Record<string, Connection>;
  vType: Record<string, VType>;
  route: Record<string, Route>;
  flow: Record<string, Flow>;
}

export interface Network extends NetworkData {
  setDocumentName: (name: string) => void;
  addNode: (node: Node) => void;
  updateNode: (nodeID: string, node: Node) => void;
  drawEdge: (from: Node, to: Node) => void;
  updateEdge: (edgeId: string, edge: Edge) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  deleteConnection: (id: string) => void;
  addConnection: (from: Edge, to: Edge) => void;
  updateFlow: (flowId: string, flow: Flow) => void;
}

export const useNetworkStore = create<Network>((set, get) => ({
  documentName: 'Untitled Document',
  nodes: {},
  edges: {},
  connections: {},
  vType: {},
  route: {},
  flow: {},
  grid: {},
  setDocumentName: name => {
    set({ documentName: name });
  },
  addNode: (node: Node) => {
    const undoStore = useUndoStore.getState();
    undoStore.pushCommand(new AddNodeCommand(get(), node));
    set(state => ({ nodes: { ...state.nodes, [node.id]: node } }));
  },
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
  drawEdge: (from, to) => {
    const undoStore = useUndoStore.getState();

    set(state => {
      const newEdgeId = `${from.id}_${to.id}`;
      const newEdge: Edge = {
        id: newEdgeId,
        from: from.id,
        to: to.id,
        priority: -1,
        numLanes: 1,
        spreadType: 'center',
        width: laneWidth,
        speed: 13.89,
        name: DEFAULT_ROAD_NAME,
      };

      const pointA = { x: from.x, y: from.y };
      const pointB = { x: to.x, y: to.y };

      if (edgeDoesIntersect(state, pointA, pointB)) {
        return state;
      } else {
        undoStore.pushCommand(new AddEdgeCommand(get(), newEdge));

        // update connections, routes, and flows when an edge is being drawn
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
    });
  },
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
        let connections = removeItems(
          state.connections,
          c => c.fromLane > edge.numLanes - 1 || c.toLane > edge.numLanes - 1,
        );

        for (const connection of affectedConnections) {
          let fromNumLanes: number;
          let toNumLanes: number;

          if (connection.from === edge.id) {
            fromNumLanes = edge.numLanes;
            toNumLanes = state.edges[connection.to].numLanes;
          } else if (connection.to === edge.id) {
            fromNumLanes = state.edges[connection.from].numLanes;
            toNumLanes = edge.numLanes;
          } else {
            continue;
          }

          connections = updateConnectionsOnLaneChange(
            connection.from,
            connection.to,
            fromNumLanes,
            toNumLanes,
            connections,
          );
        }

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
    const undoStore = useUndoStore.getState();
    undoStore.pushCommand(new RemoveNodeCommand(get(), get().nodes[id]));
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
    const undoStore = useUndoStore.getState();
    undoStore.pushCommand(new RemoveEdgeCommand(get(), get().edges[id]));

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
  deleteConnection: (id: string) => {
    set(state => {
      const newConnections = { ...state.connections };
      delete newConnections[id];
      // TODO: delete associates

      return {
        connections: newConnections,
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

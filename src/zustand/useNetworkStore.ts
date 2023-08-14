import { create } from 'zustand';

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
  addNode: node =>
    set(state => ({
      nodes: {
        ...state.nodes,
        [node.id]: node,
      },
    })),
  drawEdge: (from, to) =>
    set(state => ({
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
    })),
}));

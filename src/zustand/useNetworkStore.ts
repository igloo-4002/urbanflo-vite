import { create } from 'zustand';

export function isNode(elem: Node | Edge): elem is Node {
  return 'x' in elem && 'y' in elem;
}

export function isEdge(elem: Node | Edge): elem is Edge {
  return 'from' in elem && 'to' in elem;
}

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

export type GridCell = {
  nodes: string[];
};

export type Network = {
  nodes: Record<string, Node>;
  edges: Record<string, Edge>;
  grid: Record<string, GridCell>;
  addNode: (
    node: Node,
  ) => { status: 'ok' } | { status: 'error'; error: 'conflict' };
  drawEdge: (from: Node, to: Node) => void;
};

function computeGridKey(x: number, y: number): string {
  const size = 32;
  const gridX = Math.floor(x / size);
  const gridY = Math.floor(y / size);
  return `${gridX},${gridY}`;
}

export const useNetworkStore = create<Network>(set => ({
  nodes: {},
  edges: {},
  grid: {},
  addNode: (node: Node) => {
    let error: 'conflict' | undefined;

    set(state => {
      const key = computeGridKey(node.x, node.y);
      const existingNodeIDs = state.grid[key]?.nodes || [];

      for (const existingNodeID of existingNodeIDs) {
        const existingNode = state.nodes[existingNodeID];
        const dist = Math.sqrt(
          (existingNode.x - node.x) ** 2 + (existingNode.y - node.y) ** 2,
        );

        if (dist < 32) {
          error = 'conflict';
          return state;
        }
      }

      return {
        nodes: {
          ...state.nodes,
          [node.id]: node,
        },
        grid: {
          ...state.grid,
          [key]: { nodes: [...existingNodeIDs, node.id] },
        },
      };
    });

    if (error) {
      return { status: 'error', error };
    } else {
      return { status: 'ok' };
    }
  },
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

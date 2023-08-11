import { CanvasItemType, GraphItem } from '~/context/types';

import { ExitPath } from './exit-path';

export class TrafficGraph {
  nodes: { [key: string]: GraphItem };
  edges: ExitPath[];

  constructor() {
    this.nodes = {};
    this.edges = [];
  }

  isEmpty() {
    return this.edges.length === 0 && Object.keys(this.nodes).length === 0;
  }

  private isLeafNode(nodeId: string) {
    const node = this.nodes[nodeId];

    if (!node) return false;

    return Object.keys(node.graphInfo.exits).length >= node.graphInfo.maxExits;
  }

  getLeafNodes(): GraphItem[] {
    const leafNodes: GraphItem[] = [];

    for (const id in this.nodes) {
      if (this.isLeafNode(id)) {
        leafNodes.push(this.nodes[id]);
      }
    }

    return leafNodes;
  }

  addNode(node: GraphItem) {
    if (!this.nodes[node.id]) {
      this.nodes[node.id] = node;
    } else {
      console.error(`Node with ID ${node.id} already exists.`, { node });
    }
  }

  addEdge(startId: string, endId: string) {
    const startNode = this.nodes[startId];
    const endNode = this.nodes[endId];

    if (startNode && endNode) {
      if (!this.isLeafNode(startNode.id)) {
        console.error(`Start node ${startNode.id} is not a leaf node.`, {
          startNode,
        });
        return;
      }

      this.addNewExitToNode(startNode, this.nodes[endId]);
    } else {
      console.error(
        `Start node ${startId} or end node ${endId} does not exist.`,
        { startNode, endNode },
      );
    }
  }

  private addNewExitToNode(existingNode: GraphItem, newNode: GraphItem) {
    switch (existingNode.info.type) {
      case CanvasItemType.ROAD:
        existingNode.graphInfo.exits[0] = newNode;
        break;
      case CanvasItemType.INTERSECTION: {
        const idx = Object.keys(existingNode.graphInfo.exits).length;
        existingNode.graphInfo.exits[idx] = newNode;
        break;
      }
      default:
        break;
    }

    const newExitPath = new ExitPath(existingNode, newNode);
    this.edges.push(newExitPath);
  }

  deleteNode(nodeId: string) {
    const nodeToDelete = this.nodes[nodeId];

    if (!nodeToDelete) {
      console.error(`Node with ID ${nodeId} does not exist.`);
      return;
    }

    // 1. Remove the node from nodes list.
    delete this.nodes[nodeId];

    // 2. Update exits of the nodes that are connected to the deleted node.
    for (const id in this.nodes) {
      const node = this.nodes[id];
      for (const exitKey in node.graphInfo.exits) {
        if (node.graphInfo.exits[exitKey].id === nodeId) {
          delete node.graphInfo.exits[exitKey];
        }
      }
    }

    // 3. Remove edges that contain the deleted node.
    this.edges = this.edges.filter(
      edge => edge.start.id !== nodeId && edge.end.id !== nodeId,
    );
  }
}

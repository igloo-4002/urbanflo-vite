import { isRoad } from '~/components/CanvasItems/util';
import { CanvasItemType, GraphItem, Intersection, Road } from '~/context/types';

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

  // For now we only have intersections as graph nodes.
  // This util is here in case we add more types as graph nodes.
  private isGraphNode(node: GraphItem): node is Intersection {
    return node.info.type === CanvasItemType.INTERSECTION;
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

  addEdge(startId: string, endId: string, connectorId: string) {
    const startNode = this.nodes[startId];
    const endNode = this.nodes[endId];
    const connectorNode = this.nodes[connectorId];

    if (!startNode || !endNode || !connectorNode) {
      console.error(
        `Start node ${startId} or end node ${endId} or connector node does not exist.`,
        { startId, endId, connectorId },
      );
      return;
    }

    if (!this.isLeafNode(startNode.id)) {
      console.error(`Start node ${startNode.id} is not a leaf node.`, {
        startNode,
      });
      return;
    }

    if (
      !this.isGraphNode(startNode) ||
      !this.isGraphNode(endNode) ||
      !isRoad(connectorNode)
    ) {
      console.error(
        `Start node ${startNode.id} or end node ${endNode.id} may not be graph nodes or connector node ${connectorNode.id} is not a road.`,
        { startNode, endNode, connectorNode },
      );
      return;
    }

    this.addNewExitToEdges(startNode, endNode, connectorNode);
  }

  private addNewExitToEdges(
    existingNode: Intersection,
    newNode: Intersection,
    connectingRoad: Road,
  ) {
    // Add the new node to the existing node's exits.
    const idx = Object.keys(existingNode.graphInfo.exits).length;
    existingNode.graphInfo.exits[idx] = newNode;

    const newExitPath = new ExitPath(existingNode, newNode, connectingRoad);
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

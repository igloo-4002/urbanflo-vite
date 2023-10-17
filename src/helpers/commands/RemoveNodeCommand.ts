import { Edge, Node } from '~/types/Network';
import { Network } from '~/zustand/useNetworkStore';
import { Command } from '~/zustand/useUndoStore';

export class RemoveNodeCommand implements Command {
  constructor(
    private networkStore: Network,
    private node: Node,
    private edges: Edge[],
  ) {}

  execute() {
    this.networkStore.deleteNode(this.node.id);
  }

  unexecute() {
    this.networkStore.addNode(this.node);
    this.edges.forEach(edge => {
      const { id: _id, from: fromId, to: toId, ...rest } = edge;

      const fromNode = this.networkStore.nodes[fromId];
      const toNode = this.networkStore.nodes[toId];

      if (!fromNode && !toNode) {
        return;
      }
      this.networkStore.drawEdge(fromNode, toNode, rest);
    });
  }
}

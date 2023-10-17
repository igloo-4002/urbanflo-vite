import { Edge } from '~/types/Network';
import { Network } from '~/zustand/useNetworkStore';
import { Command } from '~/zustand/useUndoStore';

export class RemoveEdgeCommand implements Command {
  constructor(
    private networkStore: Network,
    private edge: Edge,
  ) {}

  execute() {
    this.networkStore.deleteEdge(this.edge.id);
  }

  unexecute() {
    const { id: _id, from: fromId, to: toId, ...rest } = this.edge;

    const fromNode = this.networkStore.nodes[fromId];
    const toNode = this.networkStore.nodes[toId];

    if (!fromNode && !toNode) {
      return;
    }

    this.networkStore.drawEdge(fromNode, toNode, rest);
  }
}

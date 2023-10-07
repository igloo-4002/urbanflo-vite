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
    const fromNode = this.networkStore.nodes[this.edge.from];
    const toNode = this.networkStore.nodes[this.edge.to];

    if (!fromNode && !toNode) {
      return;
    }

    this.networkStore.drawEdge(fromNode, toNode);
  }
}

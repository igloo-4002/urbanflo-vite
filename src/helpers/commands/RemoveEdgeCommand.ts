import { Edge } from '~/types/Network';
import { Network } from '~/zustand/useNetworkStore';
import { Command } from '~/zustand/useUndoStore';

export class RemoveEdgeCommand implements Command {
  constructor(
    private network: Network,
    private edge: Edge,
  ) {}

  execute() {
    this.network.deleteEdge(this.edge.id);
  }

  unexecute() {
    const fromNode = this.network.nodes[this.edge.from];
    const toNode = this.network.nodes[this.edge.to];

    if (!fromNode && !toNode) {
      return;
    }

    this.network.drawEdge(fromNode, toNode);
  }
}

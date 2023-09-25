import { Edge } from '~/types/Network';
import { Network } from '~/zustand/useNetworkStore';
import { Command } from '~/zustand/useUndoStore';

export class AddEdgeCommand extends Command {
  constructor(
    private network: Network,
    private edge: Edge,
  ) {
    super();
  }

  execute() {
    const fromNode = this.network.nodes[this.edge.from];
    const toNode = this.network.nodes[this.edge.to];

    if (!fromNode && !toNode) {
      return;
    }

    this.network.drawEdge(fromNode, toNode);
  }

  unexecute() {
    this.network.deleteEdge(this.edge.id);
  }
}

import { Node } from '~/types/Network';
import { Network } from '~/zustand/useNetworkStore';
import { Command } from '~/zustand/useUndoStore';

export class RemoveNodeCommand extends Command {
  constructor(
    private network: Network,
    private node: Node,
  ) {
    super();
  }

  execute() {
    this.network.deleteNode(this.node.id);
  }

  unexecute() {
    this.network.addNode(this.node);
  }
}

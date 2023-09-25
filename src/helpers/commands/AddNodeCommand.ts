import { Node } from '~/types/Network';
import { Network } from '~/zustand/useNetworkStore';
import { Command } from '~/zustand/useUndoStore';

export class AddNodeCommand implements Command {
  constructor(
    private network: Network,
    private node: Node,
  ) {}

  execute() {
    this.network.addNode(this.node);
  }

  unexecute() {
    this.network.deleteNode(this.node.id);
  }
}

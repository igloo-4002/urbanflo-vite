import { Node } from '~/types/Network';
import { Network } from '~/zustand/useNetworkStore';
import { Command } from '~/zustand/useUndoStore';

export class AddNodeCommand implements Command {
  constructor(
    private networkStore: Network,
    private node: Node,
  ) {}

  execute() {
    this.networkStore.addNode(this.node);
  }

  unexecute() {
    this.networkStore.deleteNode(this.node.id);
  }
}

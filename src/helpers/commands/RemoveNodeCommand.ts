import { Node } from '~/types/Network';
import { Network } from '~/zustand/useNetworkStore';
import { Command } from '~/zustand/useUndoStore';

export class RemoveNodeCommand implements Command {
  constructor(
    private networkStore: Network,
    private node: Node,
  ) {}

  execute() {
    this.networkStore.deleteNode(this.node.id);
  }

  unexecute() {
    this.networkStore.addNode(this.node);
  }
}

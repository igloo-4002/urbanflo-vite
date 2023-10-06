import { Decoration, DecorationsStore } from '~/zustand/useDecorations';
import { Command } from '~/zustand/useUndoStore';

export class RemoveDecorationCommand implements Command {
  constructor(
    private decorationStore: DecorationsStore,
    private decoration: Decoration,
  ) {}

  execute() {
    this.decorationStore.deleteItem(this.decoration.id);
  }

  unexecute() {
    this.decorationStore.addItem(this.decoration, this.decoration.seed);
  }
}

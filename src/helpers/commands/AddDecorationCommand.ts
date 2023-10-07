import { Decoration, DecorationsStore } from '~/zustand/useDecorations';
import { Command } from '~/zustand/useUndoStore';

export class AddDecorationCommand implements Command {
  constructor(
    private decorationStore: DecorationsStore,
    private decoration: Decoration,
  ) {}

  execute() {
    this.decorationStore.addItem(this.decoration, this.decoration.seed);
  }

  unexecute() {
    this.decorationStore.deleteItem(this.decoration.id);
  }
}

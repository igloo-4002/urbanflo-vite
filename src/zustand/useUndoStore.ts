import { create } from 'zustand';

export abstract class Command {
  abstract execute(): void;
  abstract unexecute(): void;
}

interface UndoRedoStore {
  undoStack: Command[];
  redoStack: Command[];
  pushCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  clearStacks: () => void;
  setStacks: (undoStack: Command[], redoStack: Command[]) => void;
}

export const useUndoStore = create<UndoRedoStore>((set, get) => ({
  undoStack: [],
  redoStack: [],
  pushCommand: command =>
    set(state => ({ undoStack: [...state.undoStack, command] })),
  undo: () => {
    const { undoStack, redoStack } = get();
    const lastCommand = undoStack.pop();

    if (!lastCommand) {
      return;
    }

    lastCommand.unexecute();
    redoStack.push(lastCommand);
  },
  redo: () => {
    const { undoStack, redoStack } = get();
    const lastCommand = redoStack.pop();

    if (!lastCommand) {
      return;
    }

    lastCommand.unexecute();
    undoStack.push(lastCommand);
  },
  clearStacks: () => set({ undoStack: [], redoStack: [] }),
  setStacks: (undoStack, redoStack) => set({ undoStack, redoStack }),
}));
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline';

import { useUndoStore } from '~/zustand/useUndoStore';

import { Tooltip } from './Tooltip';

export function UndoRedoSection() {
  const undoStore = useUndoStore();

  return (
    <div className="flex flex-row items-center gap-3">
      <Tooltip text="Undo">
        <button
          onClick={undoStore.undo}
          className={`bg-gray-200 p-1 rounded-xl ${
            undoStore.undoStack.length === 0
              ? 'cursor-not-allowed opacity-50'
              : ''
          }`}
          disabled={undoStore.undoStack.length === 0}
        >
          <ArrowUturnLeftIcon className="h-6 w-6 text-gray-800" />
        </button>
      </Tooltip>
      <Tooltip text="Redo">
        <button
          onClick={undoStore.redo}
          className={`bg-gray-200 p-1 rounded-xl ${
            undoStore.redoStack.length === 0
              ? 'cursor-not-allowed opacity-50'
              : ''
          }`}
          disabled={undoStore.redoStack.length === 0}
        >
          <ArrowUturnRightIcon className="h-6 w-6 text-gray-800" />
        </button>
      </Tooltip>
    </div>
  );
}

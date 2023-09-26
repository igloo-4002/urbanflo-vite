import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline';

import { useUndoStore } from '~/zustand/useUndoStore';

import Tooltip from './Tooltip';

export function UndoRedoSection() {
  const undoStore = useUndoStore();

  return (
    <div className="flex flex-row items-center gap-3">
      <Tooltip tooltipText="Undo">
        <button onClick={undoStore.undo} className="bg-gray-200 p-1 rounded-xl">
          <ArrowUturnLeftIcon className="h-6 w-6 text-gray-800" />
        </button>
      </Tooltip>
      <Tooltip tooltipText="Redo">
        <button onClick={undoStore.redo} className="bg-gray-200 p-1 rounded-xl">
          <ArrowUturnRightIcon className="h-6 w-6 text-gray-800" />
        </button>
      </Tooltip>
    </div>
  );
}

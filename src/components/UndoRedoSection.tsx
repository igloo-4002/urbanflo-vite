import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline';

export function UndoRedoSection() {
  return (
    <div className="flex flex-row items-center gap-3">
      <button
        onClick={() => {
          console.log('out');
        }}
        className="bg-gray-200 p-1 rounded-xl"
      >
        <ArrowUturnLeftIcon className="h-6 w-6 text-gray-800" />
      </button>
      <button
        onClick={() => {
          console.log('in');
        }}
        className="bg-gray-200 p-1 rounded-xl"
      >
        <ArrowUturnRightIcon className="h-6 w-6 text-gray-800" />
      </button>
    </div>
  );
}

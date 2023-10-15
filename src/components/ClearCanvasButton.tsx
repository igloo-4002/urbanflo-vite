import { TrashIcon } from '@heroicons/react/24/solid';

import { canvasComponentBg } from '~/colors';
import { networkHasData } from '~/helpers/zustand/NetworkStoreHelpers';
import { useNetworkStore } from '~/zustand/useNetworkStore';

export function ClearCanvasButton() {
  const network = useNetworkStore();

  function onClear() {
    if (window.confirm('Are you sure you want to delete the network?')) {
      network.clearNetwork();
    }
  }

  const isNetworkEmpty = !networkHasData(network);

  return (
    <span
      className="fixed top-32 shadow-md p-2 rounded-xl z-100 left-4"
      style={{
        backgroundColor: canvasComponentBg,
        display: isNetworkEmpty ? 'none' : 'flex',
      }}
    >
      <button
        className="p-1 hover:bg-gray-300 rounded-md duration-200"
        onClick={onClear}
      >
        <TrashIcon className="text-red-500 w-6 h-6" />
      </button>
    </span>
  );
}

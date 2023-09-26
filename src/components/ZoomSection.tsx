import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

import { SCALE_FACTOR, useStageState } from '~/zustand/useStage';

export function ZoomSection() {
  const stageStore = useStageState();

  function updateZoom(change: 'in' | 'out') {
    const newScale = {
      x: stageStore.scale.x,
      y: stageStore.scale.y,
    };

    if (change === 'in') {
      newScale.x = stageStore.scale.x * SCALE_FACTOR;
      newScale.y = stageStore.scale.y * SCALE_FACTOR;
    } else if (change === 'out') {
      newScale.x = stageStore.scale.x / SCALE_FACTOR;
      newScale.y = stageStore.scale.y / SCALE_FACTOR;
    }

    stageStore.setScale(newScale);
  }

  const zoom = Math.floor(stageStore.scale.x * 100);

  return (
    <div className="flex flex-row items-center gap-3">
      <button
        onClick={() => {
          updateZoom('out');
        }}
        className="bg-gray-200 p-1 rounded-xl"
      >
        <MinusIcon className="h-6 w-6 text-gray-800" />
      </button>
      <span className="text-lg font-semibold select-none">{zoom}%</span>
      <button
        onClick={() => {
          updateZoom('in');
        }}
        className="bg-gray-200 p-1 rounded-xl"
      >
        <PlusIcon className="h-6 w-6 text-gray-800" />
      </button>
    </div>
  );
}

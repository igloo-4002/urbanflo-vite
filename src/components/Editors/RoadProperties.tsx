import { useEffect, useState } from 'react';

import { ColumnStack, RowStack } from '~/components/Stack';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelected';

export function RoadPropertiesEditor() {
  const [newSpeedLimit, setNewSpeedLimit] = useState(0);
  const [newLanes, setNewLanes] = useState(0);

  const selected = useSelector();
  const network = useNetworkStore();

  useEffect(() => {
    if (selected.selected === null || !network.edges[selected.selected]) {
      return;
    }

    const edge = network.edges[selected.selected];

    setNewSpeedLimit(edge.speed);
    setNewLanes(edge.numLanes);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.selected]);

  function submitRoadProperties() {
    if (selected.selected === null || !network.edges[selected.selected]) {
      return;
    }

    const updatedEdge = {
      ...network.edges[selected.selected],
      numLanes: newLanes,
      speed: newSpeedLimit,
    };

    network.updateEdge(selected.selected, updatedEdge);
    selected.deselect();
  }

  return (
    <ColumnStack style={{ gap: '8px' }}>
      <RowStack>
        <p>Speed Limit</p>
        <input
          style={{ width: '30%' }}
          type="number"
          value={newSpeedLimit}
          onChange={e => setNewSpeedLimit(parseInt(e.target.value))}
        />
      </RowStack>
      <RowStack>
        <p>Number of Lanes</p>
        <input
          style={{ width: '30%' }}
          type="number"
          value={newLanes}
          onChange={e => setNewLanes(parseInt(e.target.value))}
        />
      </RowStack>
      <button
        className="rounded-md py-2 px-3 z-10 bg-amber-400"
        onClick={submitRoadProperties}
      >
        Save
      </button>
    </ColumnStack>
  );
}

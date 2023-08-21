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
    if (selected.selected === null || network.edges[selected.selected]) {
      return;
    }

    const edge = network.edges[selected.selected];

    setNewSpeedLimit(edge.speed);
    setNewLanes(edge.numLanes);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.selected]);

  function submitRoadProperties() {
    if (selected.selected === null || network.edges[selected.selected]) {
      return;
    }

    const updatedEdge = {
      ...network.edges[selected.selected],
      numLanes: newLanes,
      speed: newSpeedLimit,
    };

    network.updateEdge(selected.selected, updatedEdge);
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
        className="hover:bg-gray-300 duration-200 rounded-md"
        onClick={submitRoadProperties}
      >
        Update road properties
      </button>
    </ColumnStack>
  );
}

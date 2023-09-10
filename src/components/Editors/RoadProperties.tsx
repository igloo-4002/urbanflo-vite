import { useEffect, useState } from 'react';

import { ColumnStack, RowStack } from '~/components/Stack';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelected';

export function RoadPropertiesEditor() {
  const [newRoadName, setNewRoadName] = useState<string>('New Road');
  const [newSpeedLimit, setNewSpeedLimit] = useState(0);
  const [newLanes, setNewLanes] = useState(0);
  const [roadLength, setRoadLength] = useState(0);

  const selected = useSelector();
  const network = useNetworkStore();

  useEffect(() => {
    if (selected.selected === null || !network.edges[selected.selected]) {
      return;
    }

    const edge = network.edges[selected.selected];

    setNewSpeedLimit(Math.floor(edge.speed * 3.6));
    setNewLanes(edge.numLanes);
    setNewRoadName(edge.name);

    const from = network.nodes[edge.from];
    const to = network.nodes[edge.to];

    const dist = Math.sqrt(
      Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2),
    );
    setRoadLength(dist);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.selected, network.nodes]);

  function submitRoadProperties() {
    if (selected.selected === null || !network.edges[selected.selected]) {
      return;
    }

    const updatedEdge = {
      ...network.edges[selected.selected],
      numLanes: newLanes,
      speed: newSpeedLimit / 3.6,
      name: newRoadName,
    };

    network.updateEdge(selected.selected, updatedEdge);
    selected.deselect();
  }

  return (
    <ColumnStack style={{ gap: '8px' }}>
      <RowStack>
        <input
          className="flex items-center gap-x-1 text-sm font-semibold bg-transparent leading-6 text-gray-900"
          type="string"
          value={newRoadName}
          onChange={e => setNewRoadName(e.target.value)}
        />
      </RowStack>
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
      <RowStack>
        <p>Length of Road</p>
        <input
          style={{ width: '30%' }}
          type="number"
          value={roadLength}
          disabled
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

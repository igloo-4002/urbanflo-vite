import { useEffect, useState } from 'react';

import { ColumnStack, RowStack } from '~/components/Stack';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelected';

export function RoadPropertiesEditor() {
  const [newSpeedLimit, setNewSpeedLimit] = useState(0);
  const [newLanes, setNewLanes] = useState(0);
  const [roadLength, setRoadLength] = useState(0);
  const [newPriority, setNewPriority] = useState(-1);

  const selected = useSelector();
  const network = useNetworkStore();

  useEffect(() => {
    if (selected.selected === null || !network.edges[selected.selected]) {
      return;
    }

    const edge = network.edges[selected.selected];

    setNewSpeedLimit(Math.floor(edge.speed * 3.6));
    setNewLanes(edge.numLanes);
    setNewPriority(edge.priority);

    const from = network.nodes[edge.from];
    const to = network.nodes[edge.to];

    const dist = Math.sqrt(
      Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2),
    );
    setRoadLength(dist);
  }, [selected.selected, network.nodes]);

  function submitRoadProperties() {
    if (selected.selected === null || !network.edges[selected.selected]) {
      return;
    }

    const updatedEdge = {
      ...network.edges[selected.selected],
      numLanes: newLanes,
      speed: newSpeedLimit / 3.6,
      priority: newPriority,
    };

    network.updateEdge(selected.selected, updatedEdge);
    selected.deselect();
  }

  return (
    <ColumnStack style={{ gap: 8 }}>
      <RowStack>
        <p>Speed Limit (km/hr)</p>
        <input
          className="w-[30%] rounded-md p-1"
          type="number"
          value={newSpeedLimit}
          onChange={e => setNewSpeedLimit(parseInt(e.target.value))}
        />
      </RowStack>
      <RowStack>
        <p>Number of Lanes</p>
        <input
          className="w-[30%] rounded-md p-1"
          type="number"
          value={newLanes}
          onChange={e => setNewLanes(parseInt(e.target.value))}
        />
      </RowStack>
      <RowStack>
        <p>Length of Road (m)</p>
        <input
          className="w-[30%] rounded-md p-1"
          type="number"
          value={roadLength}
          disabled
        />
      </RowStack>
      <RowStack>
        <p>Priority</p>
        <input
          className="w-[30%] rounded-md p-1"
          type="number"
          value={newPriority}
          onChange={e => setNewPriority(parseInt(e.target.value))}
        />
      </RowStack>
      <button
        className="rounded-full py-2 px-4 text-white z-10 bg-amber-400"
        onClick={submitRoadProperties}
      >
        Save
      </button>
    </ColumnStack>
  );
}

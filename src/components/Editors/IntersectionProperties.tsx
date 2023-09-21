import { useState } from 'react';

import { ColumnStack, RowStack } from '~/components/Stack';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelected';
import { NodeType } from '~/types/Network';

// Define a type for intersection types
type IntersectionType = keyof typeof NodeType;

export function IntersectionPropertiesEditor() {
  const [intersectionType, setIntersectionType] = useState<IntersectionType>('priority');

  const selected = useSelector();
  const network = useNetworkStore();

  function submitIntersectionProperties() {
    if (selected.selected === null || !network.edges[selected.selected]) {
      return;
    }

    const updatedNode = {
      ...network.nodes[selected.selected],
      type: intersectionType,
    };

    network.updateNode(selected.selected, updatedNode);
    selected.deselect();
  }

  return (
    <ColumnStack style={{ gap: 8 }}>
      <RowStack>
        <p>Intersection Type</p>
        <select
          value={intersectionType}
          onChange={(e) => setIntersectionType(e.target.value as IntersectionType)}
          className="w-[40%] rounded-md p-1"
        >
          {Object.values(NodeType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </RowStack>
      <button
        className="rounded-full py-2 px-4 my-2 text-white z-10 bg-amber-400"
        onClick={submitIntersectionProperties}
      >
        Save
      </button>
    </ColumnStack>
  );
}






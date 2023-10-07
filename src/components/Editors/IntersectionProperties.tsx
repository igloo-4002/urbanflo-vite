import { useEffect, useState } from 'react';

import { ColumnStack, RowStack } from '~/components/Stack';
import { prettyPrintIntersectionType } from '~/helpers/format';
import { IntersectionType, NodeType } from '~/types/Network';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelector';

export function IntersectionPropertiesEditor() {
  const [intersectionType, setIntersectionType] =
    useState<IntersectionType>('priority');

  const selector = useSelector();
  const network = useNetworkStore();

  useEffect(() => {
    if (selector.selected === null || selector.selected.type !== 'node') {
      return;
    }

    const node = network.nodes[selector.selected.id];

    setIntersectionType(node.type);
  }, [selector.selected, network.nodes]);

  function submitIntersectionProperties() {
    if (selector.selected === null || !network.nodes[selector.selected.id]) {
      return;
    }

    const updatedNode = {
      ...network.nodes[selector.selected.id],
      type: intersectionType,
    };

    network.updateNode(selector.selected.id, updatedNode);
    selector.deselect();
  }

  return (
    <ColumnStack style={{ gap: 8 }}>
      <RowStack>
        <p>Intersection Type</p>
        <select
          value={intersectionType}
          onChange={e =>
            setIntersectionType(e.target.value as IntersectionType)
          }
          className="w-[40%] rounded-md p-1"
        >
          {Object.values(NodeType).map(type => (
            <option key={type} value={type}>
              {prettyPrintIntersectionType(type)}
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

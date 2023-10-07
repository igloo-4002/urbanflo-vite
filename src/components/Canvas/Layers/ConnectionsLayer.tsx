import { Layer, Line } from 'react-konva';

import { highlightColor } from '~/colors';
import {
  getEdgeTerminals,
  isEntitySelected,
} from '~/helpers/zustand/NetworkStoreHelpers';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelector';

export function ConnectionsLayer() {
  const network = useNetworkStore();
  const selector = useSelector();
  const connections = Object.values(network.connections);

  function selectConnection(connectionId: string) {
    if (selector.selected === null) {
      selector.select({ type: 'connection', id: connectionId });
    } else if (selector.selected.id === connectionId) {
      selector.deselect();
    }
  }

  return (
    <Layer>
      {connections.map((connection, index) => {
        const inward = network.edges[connection.from];
        const outward = network.edges[connection.to];

        const { leading: leadingTerminals } = getEdgeTerminals(inward);
        const { trailing: trailingTerminals } = getEdgeTerminals(outward);

        const leading = leadingTerminals[connection.fromLane];
        const trailing = trailingTerminals[connection.toLane];

        const control = {
          x: network.nodes[inward.to].x,
          y: network.nodes[inward.to].y,
        };

        const connectionId = `${connection.from}_${connection.to}_${connection.fromLane}_${connection.toLane}`;
        const isSelected = isEntitySelected(connectionId);

        return (
          <Line
            key={index}
            points={[
              leading.x,
              leading.y,
              control.x,
              control.y,
              control.x,
              control.y,
              trailing.x,
              trailing.y,
            ]}
            bezier
            stroke={isSelected ? highlightColor : 'red'}
            strokeWidth={isSelected ? 3 : 2}
            onClick={() => selectConnection(connectionId)}
          />
        );
      })}
    </Layer>
  );
}

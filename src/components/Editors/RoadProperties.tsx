import { useEffect, useState } from 'react';

import { ColumnStack, RowStack } from '~/components/Stack';
import { DEFAULT_ROAD_NAME, useNetworkStore } from '~/zustand/useNetworkStore';
import { useSelector } from '~/zustand/useSelected';

export function RoadPropertiesEditor() {
  const [newRoadName, setNewRoadName] = useState<string>('New Road');
  const [newSpeedLimit, setNewSpeedLimit] = useState(0);
  const [newLanes, setNewLanes] = useState(0);
  const [roadLength, setRoadLength] = useState(0);
  const [newPriority, setNewPriority] = useState(-1);
  const [newVehiclesPerHour, setNewVehiclesPerHour] = useState<number[]>();
  const [matchingFlowIDs, setMatchingFlowIDs] = useState<string[]>();
  // Create an array filled with empty strings of the same length as matchingIDs
  const matchingRoadNames = new Array(1000).fill('');
  const [matchingRoadNameNames] = useState<string[]>(new Array(1000).fill(''));

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
    setNewPriority(edge.priority);

    const matchingIDs = Object.keys(network.flow).filter(flowID =>
      flowID.startsWith(`flow_${edge.id}`),
    );
    setMatchingFlowIDs(matchingIDs);
    setNewVehiclesPerHour(matchingIDs.map(id => network.flow[id]?.vehsPerHour));

    for (let index = 0; index < matchingIDs.length; index++) {
      const flowId = matchingIDs[index];
      const matchedFlow = network.flow[flowId];

      if (matchedFlow) {
        const route = matchedFlow.route;

        // Use a regular expression to find the string that follows "to_"
        const match = /to_(.+)/.exec(route);

        if (match) {
          const destination = match[1];
          // Update the matchingRoadNames array directly at the corresponding index
          matchingRoadNames[index] = destination;
          // Find the edge with a matching ID
          const matchingEdge = Object.values(network.edges).find(edge =>
            edge.id.endsWith(`_${destination}`),
          );
          if (matchingEdge) {
            // Assign the matching edge's name to matchingRoadNameNames[index]
            matchingRoadNameNames[index] = matchingEdge.name;
          }
        } else {
          console.log(`For flow ${flowId}, no destination found`);
        }
      } else {
        console.log(`Flow with ID ${flowId} not found in network.flow`);
      }
    }
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
      name: newRoadName,
      priority: newPriority,
    };

    network.updateEdge(selected.selected, updatedEdge);

    if (newVehiclesPerHour) {
      matchingFlowIDs?.forEach((id, index) => {
        const updatedFlow = {
          ...network.flow[id], // Use id to access the specific flow
          vehsPerHour: newVehiclesPerHour[index], // Use index to access the new vehsPerHour value
        };

        network.updateFlow(id, updatedFlow);
      });
    }

    selected.deselect();
  }

  return (
    <ColumnStack style={{ gap: 8 }}>
      <RowStack>
        <input
          className={`w-full items-center gap-x-1 text-sm text-center font-semibold bg-transparent ${
            newRoadName === DEFAULT_ROAD_NAME && 'border'
          } rounded-full pl-2 leading-6 text-gray-900`}
          type="string"
          value={newRoadName}
          onChange={e => setNewRoadName(e.target.value)}
        />
      </RowStack>
      <RowStack>
        <p>Speed Limit</p>
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
          min={1}
          max={10}
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
          min={-1}
          max={20}
        />
      </RowStack>
      {/* {matchingFlowIDs && ( */}
      <>
        <p>Vehicles per hour to</p>
        {matchingFlowIDs &&
          newVehiclesPerHour &&
          matchingFlowIDs.map((id, index) => (
            <RowStack key={id}>
              <>
                <p> {matchingRoadNameNames[index]} </p>
                <input
                  className="w-[30%] rounded-md p-1"
                  type="number"
                  value={newVehiclesPerHour[index]}
                  onChange={e => {
                    const updatedVehiclesPerHour = [...newVehiclesPerHour];
                    updatedVehiclesPerHour[index] = parseInt(e.target.value);
                    setNewVehiclesPerHour(updatedVehiclesPerHour);
                  }}
                  min={0}
                  max={9999999}
                />
              </>
            </RowStack>
          ))}
      </>
      {/* )} */}
      <button
        className="rounded-full py-2 px-4 my-2 text-white z-10 bg-amber-400"
        onClick={submitRoadProperties}
      >
        Save
      </button>
    </ColumnStack>
  );
}

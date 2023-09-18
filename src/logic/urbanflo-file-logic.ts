import { NetworkData, useNetworkStore } from '~/zustand/useNetworkStore';
import {
  SimulationHistory,
  useSimulationHistory,
} from '~/zustand/useSimulationHistory';

interface UrbanFloFile {
  version: number;
  networkData: NetworkData;
  simulationHistory: SimulationHistory[];
}

export function getUrbanFloFileContents(): string {
  const fileContents = getFileContents();

  const jsonString = JSON.stringify(fileContents, null, 2);

  return jsonString;
}

function getFileContents(): UrbanFloFile {
  const networkStore = useNetworkStore.getState();
  const simulationHistoryStore = useSimulationHistory.getState();

  return {
    version: 1,
    networkData: {
      documentName: networkStore.documentName,
      nodes: networkStore.nodes,
      edges: networkStore.edges,
      connections: networkStore.connections,
      vType: networkStore.vType,
      route: networkStore.route,
      flow: networkStore.flow,
    },
    simulationHistory: simulationHistoryStore.history,
  };
}

export function getNetworkFromUploadedFile(json: unknown): UrbanFloFile {
  return json as UrbanFloFile;
}

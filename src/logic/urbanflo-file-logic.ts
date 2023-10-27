import { Decoration, useDecorationStore } from '~/zustand/useDecorations';
import { NetworkData, useNetworkStore } from '~/zustand/useNetworkStore';
import {
  SimulationHistory,
  useSimulationHistory,
} from '~/zustand/useSimulationHistory';

/**
 * Defines the structure of an UrbanFlo file.
 */
interface UrbanFloFile {
  version: number;
  networkData: NetworkData;
  simulationHistory: SimulationHistory[];
  decorations: {
    items: Decoration[];
  };
}

/**
 * Returns the content of an UrbanFlo file as a string.
 *
 * @returns {string} - String representation of the UrbanFlo file.
 */
export function getUrbanFloFileContents(): string {
  const fileContents = getFileContents();

  const jsonString = JSON.stringify(fileContents, null, 2);

  return jsonString;
}

/**
 * Retrieves the contents required for an UrbanFlo file.
 *
 * @returns {UrbanFloFile} - The contents of the UrbanFlo file.
 */
function getFileContents(): UrbanFloFile {
  const networkStore = useNetworkStore.getState();
  const simulationHistoryStore = useSimulationHistory.getState();
  const decorationStore = useDecorationStore.getState();

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
    decorations: {
      items: decorationStore.items,
    },
  };
}

/**
 * Converts a JSON object to an UrbanFloFile.
 *
 * @param {unknown} json - The JSON object to be converted.
 * @returns {UrbanFloFile} - The UrbanFloFile representation of the provided JSON.
 */
export function getNetworkFromUploadedFile(json: unknown): UrbanFloFile {
  return json as UrbanFloFile;
}

import { NetworkData, useNetworkStore } from '~/zustand/useNetworkStore';

interface UrbanFloFile {
  version: number;
  networkData: NetworkData;
}

export function getUrbanFloFileContents(): string {
  const fileContents = getFileContents();

  const jsonString = JSON.stringify(fileContents, null, 2);

  return jsonString;
}

function getFileContents(): UrbanFloFile {
  const networkStore = useNetworkStore.getState();

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
  };
}

export function getNetworkFromUploadedFile(json: unknown): UrbanFloFile {
  return json as UrbanFloFile;
}

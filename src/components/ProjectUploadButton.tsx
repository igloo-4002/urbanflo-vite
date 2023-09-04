import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';

import { getNetworkFromUploadedFile } from '~/logic/urbanflo-file-logic';
import { useNetworkStore } from '~/zustand/useNetworkStore';

export function ProjectUploadButton() {
  const networkStore = useNetworkStore();

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      networkStore.setDocumentName(file.name)
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const parsedJson = JSON.parse(e.target?.result as string);
          const network = getNetworkFromUploadedFile(parsedJson);

          // Clear the current canvas
          const nodeIds = Object.keys(networkStore.nodes);
          nodeIds.forEach(nodeId => {
            networkStore.deleteNode(nodeId);
          });

          // Update the state with the network
          Object.values(network.networkData.nodes).forEach(node => {
            networkStore.addNode(node);
          });
          Object.values(network.networkData.edges).forEach(edge => {
            const from = network.networkData.nodes[edge.from];
            const to = network.networkData.nodes[edge.to];
            networkStore.drawEdge(from, to);
            networkStore.updateEdge(edge.id, edge);
          });
        } catch (error) {
          console.error(
            'An error occurred while parsing the JSON file OR the file is invalid',
            error,
          );
        }
      };
      reader.readAsText(file);
    }
  }

  return (
    <label className="text-sm font-semibold leading-6 text-white bg-amber-400 rounded-xl flex py-2 px-3 cursor-pointer mt-4">
      Upload Project
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />
      <ArrowUpTrayIcon className="h-6 w-6 ml-4" aria-hidden="true" />
    </label>
  );
}

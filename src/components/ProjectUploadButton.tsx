import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';

import { getNetworkFromUploadedFile } from '~/logic/urbanflo-file-logic';
import { useErrorModal } from '~/zustand/useErrorModal.ts';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSimulationHistory } from '~/zustand/useSimulationHistory';
import { useUndoStore } from '~/zustand/useUndoStore';

export function ProjectUploadButton() {
  const networkStore = useNetworkStore();
  const simulationHistoryStore = useSimulationHistory();
  const undoStore = useUndoStore();
  const errorModal = useErrorModal();

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const parsedJson = JSON.parse(e.target?.result as string);
          const uploadedNetwork = getNetworkFromUploadedFile(parsedJson);

          // Set document name
          networkStore.setDocumentName(
            uploadedNetwork.networkData.documentName,
          );

          // Clear the current canvas
          const nodeIds = Object.keys(networkStore.nodes);
          nodeIds.forEach(nodeId => {
            networkStore.deleteNode(nodeId);
          });

          // Update the state with the network
          Object.values(uploadedNetwork.networkData.nodes).forEach(node => {
            networkStore.addNode(node);
          });
          Object.values(uploadedNetwork.networkData.edges).forEach(edge => {
            const from = uploadedNetwork.networkData.nodes[edge.from];
            const to = uploadedNetwork.networkData.nodes[edge.to];
            networkStore.drawEdge(from, to);
            networkStore.updateEdge(edge.id, edge);
          });
          // Update the state with the network
          Object.values(uploadedNetwork.simulationHistory).forEach(
            historyItem => {
              simulationHistoryStore.updateHistory(historyItem);
            },
          );

          // Since the deleteNode, addNode, and drawEdge methods add to the undo stack,
          // we want to clear after building the network.
          undoStore.clearStacks();
        } catch (error: unknown) {
          const message =
            'An error occurred while parsing the JSON file OR the file is invalid';
          console.error(message, error);
          errorModal.open('Cannot upload network', message);
        }
      };
      reader.readAsText(file);
    }
  }

  return (
    <label className="text-sm items-center font-semibold leading-6 border rounded-full flex py-2 px-4 cursor-pointer mt-4">
      Upload
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />
      <ArrowUpTrayIcon className="h-6 w-6 ml-2" aria-hidden="true" />
    </label>
  );
}

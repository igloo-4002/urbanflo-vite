import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';

import useJsonDownloader from '~/hooks/useJsonDownloader';
import { getUrbanFloFileContents } from '~/logic/urbanflo-file-logic';
import { useNetworkStore } from '~/zustand/useNetworkStore';

export function ProjectDownloadButton() {
  const downloadJson = useJsonDownloader();
  const network = useNetworkStore();
  function handleDownloadClick() {
    const jsonString = getUrbanFloFileContents();
    downloadJson(jsonString, network.documentName);
  }

  return (
    <button
      className="text-sm font-semibold leading-6 text-white bg-amber-400 rounded-xl flex py-2 px-3 mt-4"
      onClick={handleDownloadClick}
    >
      Download Project
      <ArrowDownTrayIcon className="h-6 w-6 ml-4" aria-hidden="true" />
    </button>
  );
}

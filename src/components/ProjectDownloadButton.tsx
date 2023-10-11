import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';

import useJsonDownloader from '~/hooks/useJsonDownloader';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { handleDownloadEvent } from "~/helpers/zustand/NetworkStoreHelpers.ts";

export function ProjectDownloadButton() {
  const downloadJson = useJsonDownloader();
  const network = useNetworkStore();
  function handleDownloadClick() {
    handleDownloadEvent(downloadJson, network);
  }

  return (
    <button
      className="text-sm font-semibold bg-amber-400 leading-6 items-center rounded-full flex py-2 px-4 mt-4"
      onClick={handleDownloadClick}
    >
      Download
      <ArrowDownTrayIcon className="h-6 w-6 ml-2" aria-hidden="true" />
    </button>
  );
}
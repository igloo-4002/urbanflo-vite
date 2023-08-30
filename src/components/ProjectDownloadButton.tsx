import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';

import useJsonDownloader from '~/hooks/useJsonDownloader';
import { getUrbanFloFileContents } from '~/logic/urbanflo-file-logic';

export function ProjectDownloadButton() {
  const downloadJson = useJsonDownloader();

  function handleDownloadClick() {
    const jsonString = getUrbanFloFileContents();
    downloadJson(jsonString, 'urbanflo-data.json');
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

import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

import useJsonDownloader from '~/hooks/useJsonDownloader';
import { getUrbanFloFileContents } from '~/logic/urbanflo-file-logic';

interface ProjectDownloadButtonProps {
  name: string; // Define name as a prop
}

export function ProjectDownloadButton({ name }: ProjectDownloadButtonProps) {
  const downloadJson = useJsonDownloader();

  function handleDownloadClick() {
    const jsonString = getUrbanFloFileContents();
    downloadJson(jsonString, name.concat(".json"));
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

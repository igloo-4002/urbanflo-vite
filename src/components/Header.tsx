import { useState } from 'react';

import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

import { useNetworkStore } from '~/zustand/useNetworkStore';
import { useSimulationHistory } from '~/zustand/useSimulationHistory';

import Logo from '../assets/UrbanFloLogoB&W.svg';
import { ProjectDownloadButton } from './ProjectDownloadButton';
import { ProjectUploadButton } from './ProjectUploadButton';
import { SimulationHistoryButton } from './SimulationHistory/SimulationHistoryButton';

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Header() {
  const network = useNetworkStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const simulationHistoryStore = useSimulationHistory();

  return (
    <header className="bg-white drop-shadow-lg">
      <nav
        className="mx-auto flex  items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <img className="h-10 w-auto" src={Logo} alt="" />
          </a>
          <span className="ml-8 mb-2 flex items-center gap-x-1 text-5xl font-thin leading-6 text-gray-900">
            |
          </span>
          <input
            className="ml-8 pl-2 flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 focus: border-amber-400"
            type="string"
            value={network.documentName.replace('.json', '')}
            onChange={e => network.setDocumentName(e.target.value)}
          />
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-4">
          <ProjectDownloadButton />
          <ProjectUploadButton />
          <SimulationHistoryButton />
        </div>
      </nav>
      <Dialog
        as="div"
        open={simulationHistoryStore.showHistory}
        onClose={simulationHistoryStore.closeHistory}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Urban Flo</span>
              <img className="h-8 w-auto" src={Logo} alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={simulationHistoryStore.closeHistory}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}

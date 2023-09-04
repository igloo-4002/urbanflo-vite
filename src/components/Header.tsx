import { useEffect, useState } from 'react';

import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid';

import Logo from '../assets/UrbanFloLogoB&W.svg';
import { ProjectDownloadButton } from './ProjectDownloadButton';
import { ProjectUploadButton } from './ProjectUploadButton';
import { useNetworkStore } from '~/zustand/useNetworkStore';

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Header() {
    const network = useNetworkStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [documentName, setDocumentName] = useState<string>(network.documentName)
  console.log(network.documentName)

  useEffect(() => {
    if (network.documentName) {
      // If network.documentName is not empty, set it to documentName
      setDocumentName(network.documentName.replace(/\.json$/, ''));
    }
  }, [network.documentName]);

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
            className='ml-8 pl-2 flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 focus: border-amber-400'
          type="string"
          value={documentName}
          onChange={e => setDocumentName(e.target.value)}
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
        <ProjectDownloadButton name={documentName} />

          <ProjectUploadButton />
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src={Logo} alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Company
                </a>
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}

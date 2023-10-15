import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import { BottomLeftPill } from '~/components/BottomLeftPill';
import { Canvas } from '~/components/Canvas/Canvas';
import ErrorModal from '~/components/ErrorModal.tsx';
import { FloatingPlayPause } from '~/components/FloatingPlayPause';
import { Header } from '~/components/Header';
import { LeftSideBar } from '~/components/SideBar';
import { SimulationTimer } from '~/components/SimulationTimer';
import { Toolbar } from '~/components/Toolbar/Toolbar';

function MobileBlocker() {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-orange-400 to-red-500 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-3xl font-extrabold mb-4 text-shadow">Oops!</h1>
      <p className="text-lg mb-8 text-center px-6">
        Unfortunately, our app is not available on mobile devices yet. Please
        visit us from your desktop for the full experience.
      </p>
      <div className="bg-white p-2 rounded-full flex items-center justify-center h-16 w-16">
        <ExclamationTriangleIcon className="text-orange-500" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="h-screen w-screen">
      <div className="md:hidden">
        <MobileBlocker />
      </div>
      <div className="hidden md:block">
        <Header />
        <Canvas />
        <LeftSideBar />
        <Toolbar />
        <SimulationTimer />
        <FloatingPlayPause />
        <BottomLeftPill />
        <ErrorModal />
      </div>
    </div>
  );
}

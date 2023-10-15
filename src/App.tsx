import { BottomLeftPill } from '~/components/BottomLeftPill';
import { Canvas } from '~/components/Canvas/Canvas';
import ErrorModal from '~/components/ErrorModal.tsx';
import { FloatingPlayPause } from '~/components/FloatingPlayPause';
import { Header } from '~/components/Header';
import { MobileBlocker } from '~/components/MobileBlocker';
import { LeftSideBar } from '~/components/SideBar';
import { SimulationTimer } from '~/components/SimulationTimer';
import { Toolbar } from '~/components/Toolbar/Toolbar';

import { ClearCanvasButton } from './components/ClearCanvasButton';

export default function App() {
  return (
    <div className="h-screen w-screen">
      <div className="md:hidden">
        <MobileBlocker />
      </div>
      <div className="hidden md:block">
        <Header />
        <Canvas />
        <ClearCanvasButton />
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

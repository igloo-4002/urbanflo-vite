import { BottomLeftPill } from './components/BottomLeftPill';
import { Canvas } from './components/Canvas/Canvas';
import { FloatingPlayPause } from './components/FloatingPlayPause';
import { Header } from './components/Header';
import { LeftSideBar } from './components/SideBar';
import { SimulationTimer } from './components/SimulationTimer';
import { Toolbar } from './components/Toolbar/Toolbar';

function MobileBlocker() {
  return (
    <div className="fixed inset-0 bg-white flex-col items-center justify-center p-4 flex">
      <h1 className="text-2xl font-bold mb-4">Sorry for the inconvenience!</h1>
      <p className="text-center mb-8">
        Unfortunately, our app is not available on mobile devices yet. Please
        visit us from your desktop for the full experience.
      </p>
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
      </div>
    </div>
  );
}

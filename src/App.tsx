import { Canvas } from './components/Canvas/Canvas';
import { FloatingPlayPause } from './components/FloatingPlayPause';
import { Header } from './components/Header';
import { LeftSideBar } from './components/SideBar';
import { Toolbar } from './components/Toolbar/Toolbar';
import { ZoomPill } from './components/ZoomPill';

export default function App() {
  return (
    <div className="h-screen w-screen">
      <Header />
      <Canvas />
      <LeftSideBar />
      <Toolbar />
      <FloatingPlayPause />
      <ZoomPill />
    </div>
  );
}

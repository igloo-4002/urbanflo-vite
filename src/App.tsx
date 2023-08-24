import { Canvas } from './components/Canvas/Canvas';
import FloatingPlayPause from './components/FloatingPlayPause';
import { LeftSideBar } from './components/SideBar';

export default function App() {
  return (
    <div className="h-screen w-screen items-center justify-center flex">
      <Canvas />
      <LeftSideBar />
      <FloatingPlayPause />
    </div>
  );
}

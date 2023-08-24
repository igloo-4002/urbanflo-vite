import { Canvas } from './components/Canvas/Canvas';
import FloatingPlayPause from './components/FloatingPlayPause';
import { LeftSideBar } from './components/SideBar';

export default function App() {
  return (
    <>
      <Canvas />
      <LeftSideBar />
      <FloatingPlayPause />
    </>
  );
}

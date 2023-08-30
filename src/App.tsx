import { Canvas } from './components/Canvas/Canvas';
import Header from './components/Example';
import FloatingPlayPause from './components/FloatingPlayPause';
import { LeftSideBar } from './components/SideBar';

export default function App() {
  return (
    <div className="h-screen w-screen">
      <Header />
      <Canvas />
      <LeftSideBar />
      <FloatingPlayPause />
    </div>
  );
}

import { Canvas } from './components/Canvas/Canvas';
import FloatingPlayPause from './components/FloatingPlayPause';
import { LeftSideBar } from './components/SideBar';
import Header from './components/Header'

export default function App() {
  return (
    <div className="h-screen w-screen">
      <Header/>
      <Canvas />
      <LeftSideBar />
      <FloatingPlayPause />
    </div>
  );
}

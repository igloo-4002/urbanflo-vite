import { useState } from 'react';

import { Canvas } from './components/Canvas';
import { FloatingPlayPause } from './components/FloatingPlayPause';
import { FloatingSideBar } from './components/FloatingSidebar';
import { FloatingToolBar } from './components/FloatingToolBar';
import { AppStateContext } from './context/AppStateContext';
import { getDefaultAppState } from './context/defaults';
import { type AppState } from './context/types';

function App() {
  const [appState, setAppState] = useState<AppState>(getDefaultAppState());

  return (
    <AppStateContext.Provider value={{ appState, setAppState }}>
      <FloatingSideBar />
      <FloatingToolBar />
      <FloatingPlayPause />
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <Canvas />
      </div>
    </AppStateContext.Provider>
  );
}

export default App;

import { useEffect, useRef, useState } from "react";

import Canvas from "./components/Canvas";
import FloatingPlayPause from "./components/FloatingPlayPause";
import FloatingSideBar from "./components/FloatingSidebar";
import AppStateContext from "./context/AppStateContext";
import { getDefaultAppState } from "./context/defaults";
import { type AppState } from "./context/types";

let count = 0;

const colors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FF8000",
  "#FF0080",
  "#80FF00",
  "#00FF80",
  "#0080FF",
  "#8000FF",
  "#FFC000",
  "#FF00C0",
  "#C0FF00",
  "#00FFC0",
  "#00C0FF",
  "#C000FF",
  "#FF4000",
  "#FF0040",
  "#40FF00",
  "#00FF40",
  "#0040FF",
  "#4000FF",
  "#FFA000",
  "#FF00A0",
  "#A0FF00",
  "#00FFA0",
  "#00A0FF",
  "#A000FF",
  "#FF2000",
  "#FF0020",
  "#20FF00",
  "#00FF20",
  "#0020FF",
  "#2000FF",
  "#FF9000",
  "#FF0090",
  "#90FF00",
  "#00FF90",
  "#0090FF",
  "#9000FF",
  "#FF6000",
  "#FF0060",
  "#60FF00",
  "#00FF60",
  "#0060FF",
  "#6000FF",
  "#FFD000",
  "#FF00D0",
  "#D0FF00",
  "#00FFD0",
  "#00D0FF",
  "#D000FF",
  "#FF1000",
  "#FF0010",
  "#10FF00",
  "#00FF10",
  "#0010FF",
  "#1000FF",
  "#FFB000",
  "#FF00B0",
  "#B0FF00",
  "#00FFB0",
  "#00B0FF",
  "#B000FF",
  "#FF3000",
  "#FF0030",
  "#30FF00",
  "#00FF30",
  "#0030FF",
  "#3000FF",
  "#FF8000",
  "#FF0080",
  "#80FF00",
  "#00FF80",
  "#0080FF",
  "#8000FF",
  "#FF5000",
  "#FF0050",
  "#50FF00",
  "#00FF50",
  "#0050FF",
  "#5000FF",
  "#FFC000",
  "#FF00C0",
  "#C0FF00",
  "#00FFC0",
  "#00C0FF",
  "#C000FF",
  "#FF7000",
  "#FF0070",
  "#70FF00",
  "#00FF70",
  "#0070FF",
  "#7000FF",
  "#FFE000",
  "#FF00E0",
  "#E0FF00",
  "#00FFE0",
  "#00E0FF",
  "#E000FF",
  "#FF9000",
  "#FF0090",
  "#90FF00",
  "#00FF90",
  "#0090FF",
  "#9000FF",
  "#FF4000",
  "#FF0040",
  "#40FF00",
  "#00FF40",
  "#0040FF",
  "#4000FF",
];

function App() {
  const [appState, setAppState] = useState<AppState>(getDefaultAppState());
  const [coordinates, setCoordinates] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const vehId = useRef("");
  const vehToColor = useRef<{ [key: string]: string }>({});

  useEffect(() => {
    if (appState.canvasState.isPlaying) {
      const eventSource = new EventSource(
        "http://localhost:3000/start-simulation",
      );

      eventSource.onmessage = (event) => {
        count++;
        console.log(`client ran ${count} times`);
        const coordinates = (event.data as string).split(",");
        console.log(coordinates);
        setCoordinates({
          x: Number(coordinates[1]),
          y: Number(coordinates[2]),
        });

        vehId.current = coordinates[0];
        if (!vehToColor.current[coordinates[0]]) {
          vehToColor.current[coordinates[0]] =
            colors[Math.floor(Math.random() * 101)];
        }
      };

      eventSource.onerror = (event) => {
        console.error(event);
      };

      return () => eventSource.close();
    }
  }, [appState.canvasState.isPlaying]);

  return (
    <AppStateContext.Provider value={{ appState, setAppState }}>
      <FloatingSideBar />
      <FloatingPlayPause />
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <Canvas
          x={coordinates.x}
          y={coordinates.y}
          color={vehToColor.current[vehId.current]}
        />
      </div>
    </AppStateContext.Provider>
  );
}

export default App;

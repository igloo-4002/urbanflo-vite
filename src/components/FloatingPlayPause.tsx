import { useContext } from "react";

import AppStateContext from "../context/AppStateContext";

export default function FloatingPlayPause() {
  const { appState, setAppState } = useContext(AppStateContext);

  function playPause() {
    setAppState({
      ...appState,
      canvasState: {
        ...appState.canvasState,
        isPlaying: !appState.canvasState.isPlaying,
      },
    });
  }

  return (
    <button
      style={{
        position: "fixed",
        top: 15,
        left: "50%",
        zIndex: 1000,
        backgroundColor: "#FAF9F6",
        padding: "8px 18px",
        borderRadius: "10px",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
      }}
      onClick={playPause}
    >
      {appState.canvasState.isPlaying ? "Pause" : "Play"}
    </button>
  );
}

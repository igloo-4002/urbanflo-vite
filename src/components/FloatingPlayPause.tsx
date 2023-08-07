import { useAppState } from '~/hooks/useAppState';


export function FloatingPlayPause() {
  const { appState, setAppState } = useAppState();

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
        position: 'fixed',
        top: 15,
<<<<<<< HEAD
        left: '50%',
=======
        right: 15,
>>>>>>> c65a6dc62dd3cf39b16e06fdb67ce59cf643936e
        zIndex: 1000,
        backgroundColor: '#FAF9F6',
        padding: '8px 18px',
        borderRadius: '10px',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
      }}
      onClick={playPause}
    >
      {appState.canvasState.isPlaying ? 'Pause' : 'Play'}
    </button>
  );
}

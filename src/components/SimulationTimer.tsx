import { canvasComponentBg } from '~/colors';
import { formatSimulationTime } from '~/helpers/format';
import { usePlaying } from '~/zustand/usePlaying';
import { useSimulationHistory } from '~/zustand/useSimulationHistory';
import { useSimulationTimer } from '~/zustand/useSimulationTimer';

export function SimulationTimer() {
  const { history } = useSimulationHistory();
  const { isPlaying } = usePlaying();
  const { milliseconds } = useSimulationTimer();

  if (history.length === 0 && !isPlaying) {
    return null;
  }

  return (
    <span
      className="shadow-md rounded-full py-2 px-4 top-32 w-24 right-4 fixed"
      style={{
        backgroundColor: canvasComponentBg,
      }}
    >
      {formatSimulationTime(milliseconds)}
    </span>
  );
}

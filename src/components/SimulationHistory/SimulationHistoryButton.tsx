import { useSimulationHistory } from '~/zustand/useSimulationHistory';

export function SimulationHistoryButton() {
  const simulationHistoryStore = useSimulationHistory();

  function handleClick() {
    simulationHistoryStore.openHistory();
  }

  const disabled = simulationHistoryStore.history.length === 0;

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className="text-sm font-semibold bg-amber-400 leading-6 items-center rounded-full flex py-2 px-4 mt-4 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-700"
    >
      Simulation History
    </button>
  );
}

import { getSimulationAnalytics } from '~/api/network';
import { SimulationHistory } from '~/zustand/useSimulationHistory';

interface SimulationSummaryProps {
  histroyItem: SimulationHistory;
  simulationNumber: number;
}

export function SimulationSummary({
  histroyItem,
  simulationNumber,
}: SimulationSummaryProps) {
  const summary = getSimulationAnalytics(histroyItem.simulation.output);

  const startDateTime = new Date(histroyItem.startTime).toLocaleString();
  const endDateTime = new Date(histroyItem.endTime).toLocaleString();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-2">Simulation Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium">Start Time:</h3>
          <p>{startDateTime}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">End Time:</h3>
          <p>{endDateTime}</p>
        </div>
      </div>
      {/* Render Simulation Info and Output here */}
    </div>
  );
}

import { useState } from 'react';

import { getSimulationAnalytics } from '~/api/network';
import { formatISOString } from '~/helpers/date/formatter';
import { SimulationHistory } from '~/zustand/useSimulationHistory';

interface SimulationSummaryProps {
  histroyItem: SimulationHistory;
  simulationNumber: number;
}

export function SimulationSummary({
  histroyItem,
  simulationNumber,
}: SimulationSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const summary = getSimulationAnalytics(histroyItem.simulation.output);

  const startDateTime = formatISOString(histroyItem.startTime);
  const endDateTime = formatISOString(histroyItem.endTime);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <div className="flex flex-col justify-between gap-2">
        <h2 className="text-xl font-semibold">
          Simulation Summary #{simulationNumber}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium">Start Time:</h3>
            <p>{startDateTime.date}</p>
            <p>{startDateTime.time}</p>
          </div>
          <div>
            <h3 className="text-lg font-medium">End Time:</h3>
            <p>{endDateTime.date}</p>
            <p>{endDateTime.time}</p>
          </div>
        </div>
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500"
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-2 mt-6 bg-gray-100 p-3 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">
            Detailed Simulation Metrics
          </h3>
          <div className="flex flex-col gap-2">
            <div>
              <span className="font-medium text-gray-600">
                Simulation Length:
              </span>{' '}
              <span className="text-gray-800">{summary.simulationLength}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Average Time Spent Per Car:
              </span>{' '}
              <span className="text-gray-800">
                {summary.averageDuration} seconds
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Average Waiting Time Per Car:
              </span>{' '}
              <span className="text-gray-800">
                {summary.averageWaiting} seconds
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Average Time Lost Due to Congestion:
              </span>{' '}
              <span className="text-gray-800">
                {summary.averageTimeLoss} seconds
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">
                Total Cars Completed Simulation:
              </span>{' '}
              <span className="text-gray-800">
                {summary.totalNumberOfCarsThatCompleted}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

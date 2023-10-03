import { useState } from 'react';

import { formatISOString } from '~/helpers/format';
import { SimulationHistory } from '~/zustand/useSimulationHistory';

import { DetailedMetricsContainer } from './DetailedMetricsContainer';
import { DetailedMetricsSection } from './DetailedMetricsSection';
import { DetailedMetricsSectionContainer } from './DetailedMetricsSectionContainer';

interface SimulationSummaryProps {
  histroyItem: SimulationHistory;
  simulationNumber: number;
}

export function SimulationSummary({
  histroyItem,
  simulationNumber,
}: SimulationSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const summary = histroyItem.simulation.analytics;
  const statistics = histroyItem.simulation.statistics;

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

      <DetailedMetricsContainer show={isExpanded}>
        <DetailedMetricsSectionContainer title="General stats">
          <DetailedMetricsSection
            title="Simulation Length"
            value={summary.simulationLength}
          />
          <DetailedMetricsSection
            title="Average Time Spent Per Car"
            value={`${summary.averageDuration.toFixed(2)} seconds`}
          />
          <DetailedMetricsSection
            title="Average Waiting Time Per Car"
            value={`${summary.averageWaiting.toFixed(2)} seconds`}
          />
          <DetailedMetricsSection
            title="Average Time Lost Due to Congestion"
            value={`${summary.averageTimeLoss.toFixed(2)} seconds`}
          />
          <DetailedMetricsSection
            title="Total Cars Completed Simulation"
            value={summary.totalNumberOfCarsThatCompleted}
          />
        </DetailedMetricsSectionContainer>
        <DetailedMetricsSectionContainer title="Vehicle stats">
          <DetailedMetricsSection
            title="Vehicles loaded"
            value={statistics.vehicles.loaded}
          />
          <DetailedMetricsSection
            title="Vehicles inserted"
            value={statistics.vehicles.inserted}
          />
          <DetailedMetricsSection
            title="Vehicles running"
            value={statistics.vehicles.running}
          />
          <DetailedMetricsSection
            title="Vehicles waiting"
            value={statistics.vehicles.waiting}
          />
        </DetailedMetricsSectionContainer>
        <DetailedMetricsSectionContainer title="Pedestrian stats">
          <DetailedMetricsSection
            title="Number of pedestians"
            value={statistics.pedestrianStatistics.number}
          />
          <DetailedMetricsSection
            title="Pedestian route length"
            value={statistics.pedestrianStatistics.routeLength}
          />
          <DetailedMetricsSection
            title="Pedestian duration"
            value={statistics.pedestrianStatistics.duration}
          />
          <DetailedMetricsSection
            title="Pedestian time loss"
            value={statistics.pedestrianStatistics.timeLoss}
          />
        </DetailedMetricsSectionContainer>
      </DetailedMetricsContainer>
    </div>
  );
}

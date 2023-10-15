import { useEffect, useState } from 'react';
import { CircleLoader } from 'react-spinners';

import {
  ExclamationTriangleIcon,
  PlayIcon,
  StopIcon,
} from '@heroicons/react/24/outline';

import {
  getSimulationAnalytics,
  getSimulationOutput,
  getSimulationOutputStatistics,
  uploadNetwork,
} from '~/api/network';
import { extractCarsFromSumoMessage } from '~/helpers/sumo';
import { useSimulation } from '~/hooks/useSimulation';
import {
  BASE_SIMULATION_DATA_TOPIC,
  BASE_SIMULATION_DESTINATION_PATH,
  BASE_SIMULATION_ERROR_TOPIC,
  SIMULATION_SOCKET_URL,
} from '~/simulation-urls';
import { SimulationInfo } from '~/types/Simulation';
import { useCarsStore } from '~/zustand/useCarStore';
import { useErrorModal } from '~/zustand/useErrorModal.ts';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { usePlaying } from '~/zustand/usePlaying';
import { useSimulationHistory } from '~/zustand/useSimulationHistory';

export const FloatingPlayPause = () => {
  const [loading, setLoading] = useState(false);
  const network = useNetworkStore();
  const carStore = useCarsStore();
  const player = usePlaying();
  const { subscribe, publish, isConnected, error } = useSimulation({
    brokerURL: SIMULATION_SOCKET_URL,
  });

  const simulationHistory = useSimulationHistory();
  const errorModal = useErrorModal();

  const [startTime, setStartTime] = useState<string | null>(null);
  const [simulationInfo, setSimulationInfo] = useState<SimulationInfo | null>(
    null,
  );

  // streaming of simulation data
  useEffect(() => {
    const SIMULATION_DATA_TOPIC = `${BASE_SIMULATION_DATA_TOPIC}/${player.simulationId}`;
    const SIMULATION_ERROR_TOPIC = BASE_SIMULATION_ERROR_TOPIC.replace(
      '_',
      player.simulationId ?? '',
    );
    const SIMULATION_DESTINATION_PATH = `${BASE_SIMULATION_DESTINATION_PATH}/${player.simulationId}`;

    if (player.isPlaying && isConnected) {
      console.warn('Subscribing to simulation');

      subscribe(SIMULATION_DATA_TOPIC, message => {
        const data = extractCarsFromSumoMessage(message);

        if (data) {
          carStore.setCars(data);
        }
      });
      subscribe(SIMULATION_ERROR_TOPIC, message => {
        console.error(message);
        errorModal.open(
          'An error occurred while simulation is running',
          message,
        );
      });

      publish(SIMULATION_DESTINATION_PATH, { status: 'START' });
    } else if (!player.isPlaying && isConnected) {
      console.warn('Unsubscribing from simulation');
      publish(SIMULATION_DESTINATION_PATH, { status: 'STOP' });
    } else if (!player.isPlaying && player.simulationId) {
      player.changeSimulationId(null);
    }
  }, [player.isPlaying]);

  const handleUpload = async () => {
    try {
      setLoading(true);

      const requestBody = {
        documentName: network.documentName,
        nodes: Object.values(network.nodes),
        edges: Object.values(network.edges),
        connections: Object.values(network.connections),
        vType: [
          {
            id: 'car',
            accel: 2.6,
            decel: 4.5,
            sigma: 1,
            length: 5,
            minGap: 2.5,
            maxSpeed: 30,
          },
        ],
        route: Object.values(network.route),
        flow: Object.values(network.flow),
      };

      const simInfo = await uploadNetwork(requestBody);
      setStartTime(new Date().toISOString());
      setSimulationInfo(simInfo);
      player.changeSimulationId(simInfo.id);
      player.play();
    } catch (error) {
      console.error(error);
      errorModal.open('Unable to start simulation', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOutput = async () => {
    try {
      setLoading(true);
      player.pause();
      carStore.setCars([]);

      if (!player.simulationId) {
        return;
      }

      const [simOutput, simOutputStatistics, simAnalytics] = await Promise.all([
        getSimulationOutput(player.simulationId),
        getSimulationOutputStatistics(player.simulationId),
        getSimulationAnalytics(player.simulationId),
      ]);

      if (startTime && simulationInfo) {
        simulationHistory.updateHistory({
          startTime,
          endTime: new Date().toISOString(),
          simulation: {
            info: simulationInfo,
            output: simOutput,
            statistics: simOutputStatistics,
            analytics: simAnalytics,
          },
        });
      }
    } catch (error: unknown) {
      console.error(error);
      errorModal.open(
        'Unable to get simulation output',
        (error as Error).message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 py-2 items-center justify-center rounded-full flex z-10 gap-4">
      {error && (
        <div className="flex items-center bg-red-100 p-2 rounded-full shadow-lg animate-fadeIn transform-gpu">
          <ExclamationTriangleIcon
            width={24}
            height={24}
            className="text-red-500 animate-bounce"
          />
          <span className="text-red-500 font-bold ml-2">{error.message}</span>
        </div>
      )}
      <button
        onClick={player.isPlaying ? handleOutput : handleUpload}
        className="flex items-center bg-orange-500 text-white font-sans w-18 rounded-full font-bold h-10 px-4 py-2 justify-between disabled:cursor-not-allowed disabled:text-gray-700 disabled:bg-gray-300"
        disabled={loading || !!error}
      >
        {loading ? (
          <CircleLoader size={20} color="white" />
        ) : player.isPlaying ? (
          'End'
        ) : (
          'Start'
        )}
        {player.isPlaying ? (
          <StopIcon className="h-5 ml-2" strokeWidth={3} />
        ) : (
          <PlayIcon className="h-5 ml-2" strokeWidth={3} />
        )}
      </button>
    </div>
  );
};

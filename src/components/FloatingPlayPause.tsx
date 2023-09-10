import { useEffect, useState } from 'react';
import { CircleLoader } from 'react-spinners';

import { PlayIcon, StopIcon } from '@heroicons/react/24/outline';

import { getSimulationOutput, uploadNetwork } from '~/api/network';
import { extractCarsFromSumoMessage } from '~/helpers/sumo';
import { useSimulation } from '~/hooks/useSimulation';
import {
  BASE_SIMULATION_DATA_TOPIC,
  BASE_SIMULATION_DESTINATION_PATH,
  BASE_SIMULATION_ERROR_TOPIC,
  SIMULATION_SOCKET_URL,
} from '~/simulation-urls';
import { useCarsStore } from '~/zustand/useCarStore';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { usePlaying } from '~/zustand/usePlaying';

export const FloatingPlayPause = () => {
  const [loading, setLoading] = useState(false);
  const network = useNetworkStore();
  const carStore = useCarsStore();
  const player = usePlaying();
  const { subscribe, publish, isConnected } = useSimulation({
    brokerURL: SIMULATION_SOCKET_URL,
  });

  // streaming of simulation data
  useEffect(() => {
    const SIMULATION_DATA_TOPIC = `${BASE_SIMULATION_DATA_TOPIC}/${player.simulationId}`;
    const SIMULATION_ERROR_TOPIC = BASE_SIMULATION_ERROR_TOPIC.replace(
      '_',
      player.simulationId ?? '',
    );
    const SIMULATION_DESTINATION_PATH = `${BASE_SIMULATION_DESTINATION_PATH}/${player.simulationId}`;

    if (player.isPlaying && isConnected) {
      console.warn('Subscribing to simulation data');

      subscribe(SIMULATION_DATA_TOPIC, message => {
        const data = extractCarsFromSumoMessage(message);

        if (data) {
          carStore.setCars(data);
        }
      });
      subscribe(SIMULATION_ERROR_TOPIC, message => {
        console.error(message);
      });

      publish(SIMULATION_DESTINATION_PATH, { status: 'START' });
    } else if (!player.isPlaying && isConnected) {
      console.warn('Unsubscribing from simulation data');
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
      player.changeSimulationId(simInfo.id);
      player.play();
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOutput = async () => {
    try {
      setLoading(true);
      player.pause();

      if (!player.simulationId) {
        return;
      }

      const simOutput = await getSimulationOutput(player.simulationId);

      console.log({ simOutput });
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 items-center justify-center rounded-full flex py-2 px-4 z-10 bg-orange-500">
      <button
        onClick={player.isPlaying ? handleOutput : handleUpload}
        className="flex items-center text-white font-sans w-16 font-bold h-8 justify-between"
        disabled={loading}
      >
        {loading ? (
          <CircleLoader size={20} color="white" />
        ) : player.isPlaying ? (
          'End'
        ) : (
          'Play'
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

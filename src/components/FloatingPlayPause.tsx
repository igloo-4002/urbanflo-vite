import { useState } from 'react';
import { CircleLoader } from 'react-spinners';

import { PlayIcon, StopIcon } from '@heroicons/react/24/outline';

import { getSimulationOutput, uploadNetwork } from '~/api/network';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { usePlaying } from '~/zustand/usePlaying';

export const FloatingPlayPause = () => {
  const [loading, setLoading] = useState(false);
  const network = useNetworkStore();
  const player = usePlaying();

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
    player.pause();

    if (!player.simulationId) {
      return;
    }

    const simOutput = await getSimulationOutput(player.simulationId);

    console.log({ simOutput });
  };

  return (
    <div className="absolute bottom-4 right-4 items-center justify-center rounded-full flex py-2 px-4 z-10 w-24 bg-orange-500">
      <button
        onClick={player.isPlaying ? handleOutput : handleUpload}
        className="flex items-center text-white font-sans font-medium h-8"
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
          <StopIcon className="h-5 ml-2" />
        ) : (
          <PlayIcon className="h-5 ml-2" />
        )}
      </button>
    </div>
  );
};

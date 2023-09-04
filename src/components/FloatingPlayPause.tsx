import { PlayIcon } from '@heroicons/react/24/outline';

import { BASE_URL } from '~/simulation-urls';
import { useNetworkStore } from '~/zustand/useNetworkStore';
import { usePlaying } from '~/zustand/usePlaying';

const FloatingPlayPause = () => {
  const network = useNetworkStore();
  const { isPlaying, play, changeSimulationId, pause } = usePlaying();

  console.log(network.documentName)
  const handleUpload = async () => {
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

    const response = await fetch(`${BASE_URL}/simulation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(response);
      throw new Error(JSON.stringify(response));
    }

    const res = await response.json();
    changeSimulationId(res.id);
    play();
  };

  return (
    <div className="absolute bottom-4 right-4 items-center justify-center rounded-md flex py-2 px-3 z-10 bg-orange-500">
      <button
        onClick={() => {
          isPlaying ? pause() : handleUpload();
        }}
        className="text-white font-sans font-medium"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {isPlaying ? 'Pause' : 'Play'}
        <PlayIcon className="h-5 ml-2" />
      </button>
    </div>
  );
};

export default FloatingPlayPause;

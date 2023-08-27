import { BASE_URL } from '~/simulation-urls';
import { useNetworkStore } from '~/zustand/useNetworkStore';

const FloatingPlayPause = () => {
  const network = useNetworkStore();

  const handleUpload = async () => {
    const requestBody = {
      nodes: Object.values(network.nodes),
      edges: Object.values(network.edges),
      connections: Object.values(network.connections),
      vType: Object.values(network.vType),
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
    }

    console.log(await response.json());
  };

  return (
    <div
      className="absolute bottom-4 right-4 items-center justify-center rounded-md flex py-2 px-3 z-10 bg-orange-500"
    >
      <button
        onClick={handleUpload}
        className="text-white font-sans font-medium"
      >
        Play
      </button>
    </div>
  );
};

export default FloatingPlayPause;

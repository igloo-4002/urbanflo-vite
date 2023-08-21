import React from "react";
import { Network } from "~/zustand/useNetworkStore";

const FloatingPlayPause = ({ nodes, edges, connections, vType, route, flow}: Network) => {

  const handleDownload = async () => {
    const requestBody = {
      nodes,
      edges,
      connections,
      vType,
      route,
      flow
    };
  
    const response = await fetch('http://localhost:8080/simulation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    

    if (!response.ok) {
      console.error(response)
    }


    console.log(await response.json())
  };

  return (
    <div
      className="absolute bottom-4 right-4 items-center justify-center rounded-full flex p-4 z-10"
      style={{ backgroundColor: "green" }}
    >
      <button
        onClick={handleDownload}
        className="text-white font-sans font-medium"
      >
        Play
      </button>
    </div>
  );
};

export default FloatingPlayPause;
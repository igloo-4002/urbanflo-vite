import React from "react";

const FloatingPlayPause = ({ nodes, edges, connections }) => {
  
  const handleDownload = () => {
    console.log("Send the data to SUMO")
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
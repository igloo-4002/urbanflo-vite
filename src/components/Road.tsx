import React, { useState } from "react";

function Road() {
  const [speedLimit, setSpeedLimit] = useState("");
  const [numLanes, setNumLanes] = useState("");
  const [direction, setDirection] = useState("north");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSpeedLimitChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSpeedLimit(event.target.value);
  };

  const handleNumLanesChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setNumLanes(event.target.value);
  };

  const handleDirectionChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setDirection(event.target.value);
  };

  return (
    <div>
      <div
        style={{
          backgroundColor: "#F7B326",
          width: "100px",
          height: "20px",
        }}
        onClick={handleSidebarToggle}
      ></div>
      {sidebarOpen && (
        <div
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            backgroundColor: "white",
            padding: "10px",
          }}
        >
          <h2>Set Road Properties</h2>
          <label>
            Speed Limit:
            <input
              type="number"
              value={speedLimit}
              onChange={handleSpeedLimitChange}
            />
          </label>
          <label>
            Number of Lanes:
            <input
              type="number"
              value={numLanes}
              onChange={handleNumLanesChange}
            />
          </label>
          <label>
            Direction:
            <select value={direction} onChange={handleDirectionChange}>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

export default Road;

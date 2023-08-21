import React from "react";

const FloatingPlayPause = ({ nodes, edges, connections }) => {
    console.log(nodes)
    console.log(edges)
    console.log(connections)
  const handleDownload = () => {
    const xmlContentNodes = generateXmlNodes(nodes);
    const xmlContentEdges = generateXmlEdges(edges);
    const xmlContentConnections = generateXmlConnections(connections);
    // const xmlContentRoutes = generateXmlRoutes(connections);
    const blobNodes = new Blob([xmlContentNodes], { type: "application/xml" });
    const blobEdges = new Blob([xmlContentEdges], { type: "application/xml" });
    const blobConnections = new Blob([xmlContentConnections], { type: "application/xml" });
    // const blobRoutes = new Blob([xmlContentRoutes], { type: "application/xml" });
    const urlNodes = URL.createObjectURL(blobNodes);
    const urlEdges = URL.createObjectURL(blobEdges);
    const urlConnections = URL.createObjectURL(blobConnections);
    // const urlRoutes = URL.createObjectURL(blobRoutes);
    const a = document.createElement("a");
    a.href = urlNodes;
    a.download = "t.nod.xml";
    a.click();
    URL.revokeObjectURL(urlNodes);
    const b = document.createElement("a");
    b.href = urlEdges;
    b.download = "t.edg.xml";
    b.click();
    URL.revokeObjectURL(urlEdges);
    const c = document.createElement("a");
    c.href = urlConnections;
    c.download = "t.con.xml";
    c.click();
    URL.revokeObjectURL(urlConnections);
    // const d = document.createElement("a");
    // d.href = urlRoutes;
    // d.download = "t.rou.xml";
    // d.click();
    // URL.revokeObjectURL(urlRoutes);
  };

  const generateXmlNodes = (nodes) => {
    // You can create your own XML structure here based on the nodes and edges data
    // For simplicity, I'll use a basic example
    const xmlNodes = nodes.map((node) => `<node id="${node.id}" x="${node.x}" y="${node.y}" type="${node.type}" />`);

    const xml = `
      <nodes>
        ${xmlNodes.join("\n")}
      </nodes>
    `;

    return xml;
  };

  const generateXmlEdges = (edges) => {
    // You can create your own XML structure here based on the nodes and edges data
    // For simplicity, I'll use a basic example
    const xmlEdges = edges.map((edge) => `<edge id="${edge.id}" from="${edge.from}" to="${edge.to}" numLanes="${edge.numLanes}" speed="${edge.speed}" />`);

    const xml = `
      <edges>
        ${xmlEdges.join("\n")}
      </edges>
    `;

    return xml;
  };

  const generateXmlConnections = (connections) => {
    // You can create your own XML structure here based on the nodes and edges data
    // For simplicity, I'll use a basic example

    const xmlConnections = connections.map(
      (connection) =>
        `<connection from="${connection.from}" to="${connection.to}" fromLane="${connection.fromLane}" toLane="${connection.toLane}" />`
    );


    const xml = `
      <connections>
        ${xmlConnections.join("\n")}
      </connections>
    `;

    return xml;
  };

//   const generateXmlRoutes = (connections) => {
//     // You can create your own XML structure here based on the nodes and edges data
//     // For simplicity, I'll use a basic example
    
//     const xmlVType = vTypes.map( (vType) => '<vType id="car" accel="2.6" decel="4.5" sigma="0.5" length="5" minGap="2.5" maxSpeed="70"/>');
//     const xmlRoutes = connections.map(
//       (connection) =>
//         `<route id="${connection.from+connection.to}" edges="${connection.from + ' ' + connection.to}" />`
//     );
//     // const xmlFlow = 


//     const xml = `
//       <routes>
//         ${xmlConnections.join("\n")}
//       </routes>
//     `;

//     return xml;
//   };

  return (
    <div
      className="absolute bottom-4 right-4 items-center justify-center rounded-full flex p-4 z-10"
      style={{ backgroundColor: "green" }}
    >
      <button
        onClick={handleDownload}
        className="text-white font-sans font-medium"
      >
        Download XML
      </button>
    </div>
  );
};

export default FloatingPlayPause;
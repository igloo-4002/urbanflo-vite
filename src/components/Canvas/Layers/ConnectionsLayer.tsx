import { Layer, Line } from 'react-konva';

import { Point, useNetworkStore } from '~/zustand/useNetworkStore';

type BezierCurveProps = {
  source: Point;
  sink: Point;
  control: Point;
};

export function BezierCurve({ source, sink, control }: BezierCurveProps) {
  const points = [source.x, source.y, control.x, control.y, sink.x, sink.y];

  return <Line points={points} stroke="black" bezier />;
}

export function ConnectionsLayer() {
  const network = useNetworkStore();
  const connections = Object.values(network.connections);

  const curves = connections.map(conn => {
    const inbound = network.edges[conn.from];
    const outbound = network.edges[conn.to];
    const over = network.nodes[conn.over];

    const source = network.nodes[inbound.from];
    const sink = network.nodes[outbound.to];
    const control = { x: over.x, y: over.y };

    return { source, sink, control };
  });

  return (
    <Layer>
      {curves.map((props, index) => {
        return <BezierCurve key={index} {...props} />;
      })}
    </Layer>
  );
}

import { create } from 'zustand';

import { Point } from '~/types/Network';

export type FlowMeasurement = {
  id: string;
  A: Point;
  B: Point;
  flow: number; // current flow
};

export type PointType = 'A' | 'B';

type Measurements = {
  flowMeasurements: Record<string, FlowMeasurement>;
  addFlowMeasurement: (flowMeasurement: FlowMeasurement) => void;
  deleteFlowMeasurement: (id: string) => void;
  updateFlowMeasurementPoint: (
    id: string,
    pointType: PointType,
    newPoint: Point,
  ) => void;
  updateFlowMeasurement: (id: string, newFlow: number) => void;
};

export const useMeasurements = create<Measurements>(set => ({
  flowMeasurements: {},
  addFlowMeasurement: flowMeasurement =>
    set(state => ({
      flowMeasurements: {
        ...state.flowMeasurements,
        [flowMeasurement.id]: flowMeasurement,
      },
    })),
  deleteFlowMeasurement: id =>
    set(state => {
      const newFlowMeasurements = { ...state.flowMeasurements };
      delete newFlowMeasurements[id];
      return {
        flowMeasurements: newFlowMeasurements,
      };
    }),
  updateFlowMeasurementPoint: (
    id: string,
    pointType: PointType,
    newPoint: Point,
  ) =>
    set(state => ({
      flowMeasurements: {
        ...state.flowMeasurements,
        [id]: {
          ...state.flowMeasurements[id],
          [pointType]: newPoint,
        },
      },
    })),
  updateFlowMeasurement: (id: string, newFlow: number) => {
    set(state => ({
      flowMeasurements: {
        ...state.flowMeasurements,
        [id]: {
          ...state.flowMeasurements[id],
          flow: newFlow,
        },
      },
    }));
  },
}));

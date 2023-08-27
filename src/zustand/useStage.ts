import { RefObject, createRef } from 'react';

import Konva from 'konva';
import { create } from 'zustand';

import { Point } from './useNetworkStore';

type StageState = {
  position: Point;
  scale: Point;
  ref: RefObject<Konva.Stage>;
  setPosition: (p: Point) => void;
  setScale: (p: Point) => void;
};

export const useStageState = create<StageState>(set => ({
  position: { x: 0, y: 0 },
  scale: { x: 1, y: 1 },
  ref: createRef<Konva.Stage>(),
  setPosition: (p: Point) => set({ position: p }),
  setScale: (p: Point) => set({ scale: p }),
}));

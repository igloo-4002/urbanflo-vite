import { RefObject, createRef } from 'react';

import Konva from 'konva';
import { create } from 'zustand';

import { Point } from '~/types/Network';

export const SCALE_FACTOR = 1.05;
export const MIN_SCALE = 2.7;
export const MAX_SCALE = 1 / MIN_SCALE;

type StageState = {
  position: Point;
  scale: Point;
  ref: RefObject<Konva.Stage>;
  setPosition: (p: Point) => void;
  setScale: (p: Point) => void;
};

export const useStageState = create<StageState>((set, get) => ({
  position: { x: 0, y: 0 },
  scale: { x: 1, y: 1 },
  ref: createRef<Konva.Stage>(),
  setPosition: (p: Point) => {
    const { ref } = get();
    ref.current?.position(p);
    set({ position: p });
  },
  setScale: (p: Point) => {
    const { ref } = get();
    const newScale = p.x;

    if (newScale < MAX_SCALE || newScale > MIN_SCALE) {
      return;
    }

    ref.current?.scale(p);
    set({ scale: p });
  },
}));

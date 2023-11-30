import { create } from 'zustand'
import type {} from '@redux-devtools/extension'

import { SegmentType } from '@/types/segment'

interface SegmentState {
  segments: Record<number, SegmentType[]>;
  setSegments: (segments: Record<number, SegmentType[]>) => void
}

const useSegmentStore = create<SegmentState>((set) => ({
  segments: {},
  setSegments: (segments) => set((state) => ({ segments })),
}));

export { useSegmentStore }

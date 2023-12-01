import { create } from 'zustand'
import type {} from '@redux-devtools/extension'

import { SegmentType } from '@/types/segment'

interface SegmentState {
  segments: Record<number, SegmentType[]>;
  setSegments: (segments: Record<number, SegmentType[]>) => void
  updateSubtitle: (episodeId: number, segmentId: number, value: string) => void
}

const useSegmentStore = create<SegmentState>((set) => ({
  segments: {},
  setSegments: (segments) => set((state) => ({ segments })),
  updateSubtitle: (episodeId, segmentId, value) => set((state) => {
    const newSegment = state.segments[episodeId].map(segment => {
      if (segment.id === segmentId) {
        return {
          ...segment,
          subtitle: {
            ...segment?.subtitle,
            content: value,
            history: [
              ...segment?.subtitle.history,
              segment?.subtitle.content
            ],
          }
        }
      }
      return segment
    })

    return { segments: {
      ...state.segments,
      [episodeId]: newSegment
     }}
  }),
}));

export { useSegmentStore }

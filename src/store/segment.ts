import { create } from 'zustand'
import type {} from '@redux-devtools/extension'

import { SegmentType } from '@/types/segment'

interface SegmentState {
  segments: Record<number, SegmentType[]>;
  setSegments: (segments: Record<number, SegmentType[]>) => void
  updateSubtitle: (episodeId: number, segmentId: number, value: string) => void
  setSuggestionImplemented: (episodeId: number, segmentId: number, suggestionId: number) => void
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
  // addSuggestionHistory: (episodeId, segmentId, type) => set((state) => {
  //   const newSegment = state.segments[episodeId].map(segment => {
  //     if (segment.id === segmentId) {
  //       return {
  //         ...segment,
  //         suggestionHistory: [
  //           ...segment.suggestionHistory,
  //           type,
  //         ],
  //       }
  //     }
  //     return segment
  //   })

  //   return { segments: {
  //     ...state.segments,
  //     [episodeId]: newSegment
  //    }}
  // }),
  setSuggestionImplemented: (episodeId, segmentId, suggestionId) => set((state) => {
    const newSegment = state.segments[episodeId].map(segment => {
      if (segment.id === segmentId) {
        return {
          ...segment,
          suggestions: segment.suggestions?.map(suggestion => {
            if (suggestion.id === suggestionId) suggestion.isImplemented = true
            return suggestion
          })
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

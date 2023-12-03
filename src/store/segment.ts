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

const mapSegmentData = (segment: any) => ({
  id: segment.id,
  userId: segment.user_id,
  videoId: segment.video_id,
  startTime: segment.start_time,
  endTime: segment.end_time,
  subtitle: {
    id: segment.subtitle.id,
    userId: segment.subtitle.user_id,
    videoId: segment.subtitle.video_id,
    segmentId: segment.subtitle.segment_id,
    languageCode: segment.subtitle.language_code,
    content: segment.subtitle.content,
    history: [],
  },
  suggestions: segment.subtitle_suggestions && segment.subtitle_suggestions.map((suggestion: any) => ({
    id: suggestion.id,
    segmentId: suggestion.segment_id,
    subtitleId: suggestion.subtitle_id,
    type: suggestion.type,
    oldContent: suggestion.old_content,
    newContent: suggestion.new_content,
    diffContent: suggestion.diff_content,
  })),
  suggestionHistory: [],
})

export { useSegmentStore, mapSegmentData }

import { create } from 'zustand'
import type {} from '@redux-devtools/extension'

import { SubType } from '@/types/subtitle'

interface SubtitleState {
  subtitles: SubType[]
  setSubtitles: (subtitles: SubType[]) => void
}

const Subtitles = [
  {
    from: 0,
    to: 3,
    text: 'This is a sample subtitle',
  },
  {
    from: 4,
    to: 8,
    text: 'hahaha',
  },
  {
    from: 11,
    to: 20,
    text: '♫ The quick brown fox jumps over the lazy dog. ♫',
  },
  {
    from: 30,
    to: 35,
    text: '♫ yoyoyoyoyoyo. ♫',
  },
  {
    from: 60,
    to: 65,
    text: 'subber tools',
  }
]

const useSubtitleStore = create<SubtitleState>((set) => ({
  subtitles: Subtitles,
  setSubtitles: (subtitles) => set((state) => ({ subtitles })),
}));

export { useSubtitleStore }

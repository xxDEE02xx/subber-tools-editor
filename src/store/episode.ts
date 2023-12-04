import { create } from 'zustand'
import type {} from '@redux-devtools/extension'

import { EpisodeType } from '@/types/episode'

interface EpisodeState {
  episodes: EpisodeType[]
  activeEpisodeId: number
  activePartId: number
  setActiveEpisodeId: (episodeId: number) => void
  setActivePartId: (partId: number) => void
  setEpisodes: (episodes: EpisodeType[]) => void
  setDone: (episodeId: number, partId: number) => void
  setUnDone: (episodeId: number, partId: number) => void
}

const Episodes = [
  {
    id: 1,
    title: 'Episode 1',
    parts: []
  },
  {
    id: 2,
    title: 'Episode 2',
    parts: []
  },
]

const useEpisodeStore = create<EpisodeState>((set) => ({
  episodes: Episodes,
  activeEpisodeId: Episodes[1].id,
  activePartId: 0,
  setActiveEpisodeId: (episodeId) => set((state) => ({ activeEpisodeId: episodeId })),
  setActivePartId: (partId) => set((state) => ({ activePartId: partId })),
  setEpisodes: (episodes) => set((state) => ({ episodes})),
  setDone: (episodeId, partId) => set((state) => {
    const updatedEpisodes = state.episodes.map(episode => {
      if (episode.id === episodeId) {
        episode.parts = episode.parts.map(part => {
          if (part.id === partId) {
            part.completed = true
          }
          return part
        })
      }
      return episode
    })

    const activeEpisode = state.episodes.find(episode => episode.id === episodeId) as EpisodeType
    const activeEpisodePartsDone = activeEpisode.parts.filter(part => part.completed)

    let toUpdate:Record<any, any> = {
      episodes: updatedEpisodes
    }

    if (activeEpisode.parts.length === activeEpisodePartsDone.length) {
      let isFound = false
      const nextEpisode = state.episodes.filter(episode => {
        if (isFound) return true
        if (episode.id === episodeId) isFound = true
        return false
      })

      if (nextEpisode.length > 0) {
        toUpdate = {
          ...toUpdate,
          activeEpisodeId: nextEpisode[0].id,
          activePartId: nextEpisode[0].parts[0].id,
        }
      }
    } else {
      const notDoneParts = activeEpisode.parts.filter(part => !part.completed)
      if (notDoneParts.length > 0) {
        toUpdate = {
          ...toUpdate,
          activePartId: notDoneParts[0].id
        }
      }
    }

    return toUpdate
  }),
  setUnDone: (episodeId, partId) => set((state) => {
    const updatedEpisodes = state.episodes.map(episode => {
      if (episode.id === episodeId) {
        episode.parts = episode.parts.map(part => {
          if (part.id === partId) {
            part.completed = false
          }
          return part
        })
      }
      return episode
    })

    return { episodes: updatedEpisodes }
  }),
}));

const mapPartData = (part: any, completed: boolean) => ({
  id: part.id,
  completed: completed,
  title: `Part ${part.number}`,
  startTime: part.start_time,
  endTime: part.end_time,
  number: part.number,
})

export { useEpisodeStore, mapPartData }

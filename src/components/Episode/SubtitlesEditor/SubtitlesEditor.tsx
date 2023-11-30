'use client'
import React, { FC, useMemo } from 'react'

import { useSegmentStore } from '@/store/segment'
import { useEpisodeStore } from '@/store/episode'

import { EpisodeType, PartType } from '@/types/episode'

import subtitlesEditorStyles from './subtitlesEditor.module.css'

import { Item } from './Item'

const SubtitlesEditor: FC<SubtitlesEditorProps> = ({ showAndSeekPlayer, completed}) => {
  const [episodes, activeEpisodeId, activePartId] = useEpisodeStore((state) => [
    state.episodes,
    state.activeEpisodeId,
    state.activePartId,
  ])
  const [segments] = useSegmentStore((state) => [
    state.segments,
  ])

  const segmentsByPart = useMemo(() => {
    const activeSegments = segments[activeEpisodeId]
    if (activeSegments) {
      const activeEpisode = episodes.find(episode => episode.id === activeEpisodeId) as EpisodeType
      const activeParts = activeEpisode.parts.find(part => part.id === activePartId) as PartType

      return activeSegments.filter(segment => {
        return segment.startTime >= activeParts.startTime && segment.endTime <= activeParts.endTime
      })
    }
    return []

  }, [activeEpisodeId, activePartId, segments])

  return (
    <div className={subtitlesEditorStyles.wrapper}>
      {segmentsByPart.map(segment => (
        <Item
          key={`segment-part-subtitle-${segment.id}`}
          showAndSeekPlayer={showAndSeekPlayer}
          data={segment.subtitle.content}
          duration={{from: (segment.startTime / 1000), to: (segment.endTime / 1000)}}
          completed={completed}
          suggestions={segment.suggestions}
        />
      ))}
    </div>
  )
}

type SubtitlesEditorProps = {
  showAndSeekPlayer: (value: number) => void;
  completed: boolean;
}

export { SubtitlesEditor }

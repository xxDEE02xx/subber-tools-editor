'use client'
import React, { FC, useEffect, useState, useRef, useMemo } from 'react'
import { Rnd } from "react-rnd"
import ReactPlayer from 'react-player/file'

import { useSegmentStore } from '@/store/segment'
import { useEpisodeStore } from '@/store/episode'

import { EpisodeType, PartType } from '@/types/episode'

import playerStyles from './player.module.css'

import { Subtitle } from './Subtitle'

const Player: FC<PlayerProps> = ({
  seek,
  shouldShowPlayer,
  hidePlayer,
  episodeCount
}) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [position, setPosition] = useState<Record<string, number>>({ x: 0, y: 0 })
  const [playing, setPlaying] = useState<boolean>(false)

  useEffect(() => {
    setPosition({ x: window.innerWidth - 789, y: window.innerHeight - 400 })
  }, [])

  useEffect(() => {
    if (playerRef?.current && seek) {
      (playerRef as any).current.seekTo(seek)
      setPlaying(true)
    }
  }, [playerRef, seek])
  
  const onHidePlayer = () => {
    setPlaying(false)
    hidePlayer()
  }

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

  if (position.x === 0) return null

  return (
    <Rnd
      default={{
        x: position.x,
        y: position.y,
        width: shouldShowPlayer ? 500 : 0,
        height: shouldShowPlayer ? 300 : 0,
      }}
      minWidth={shouldShowPlayer ? 500 : 0}
      minHeight={shouldShowPlayer ? 300 : 0}
      bounds="parent"
      dragHandleClassName="header-draggable"
    >
      <div className={playerStyles.content} style={{ display: shouldShowPlayer ? 'block' : 'none' }}>
          <h1 className={`header-draggable ${playerStyles.header}`}>
            <p>Meow~Ears Up! - Episode {episodeCount}</p>
            <button onClick={onHidePlayer}>close</button>
          </h1>
          <div className={playerStyles.videoWrapper}>
            <div className={playerStyles.playerWrapper}>
              <ReactPlayer
                ref={playerRef}
                key={1}
                url={`/video/meow-episode-${episodeCount}.mp4`}
                controls={true}
                pip={false}
                width="100%"
                height="100%"
                onError={e => console.log('onError', e)}
                playing={playing}
              />
              <Subtitle playerRef={playerRef} segments={segmentsByPart} />
            </div>
          </div>
      </div>
    </Rnd>
  )
}

type PlayerProps = {
  seek: number | null;
  shouldShowPlayer?: boolean;
  hidePlayer: () => void;
  episodeCount: number;
}

export { Player }

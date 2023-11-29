'use client'
import React, { FC, useEffect, useState, useRef } from 'react'
import { Rnd } from "react-rnd"
import ReactPlayer from 'react-player/file'

import { SubType } from '@/types/subtitle'

import playerStyles from './player.module.css'

import { Subtitle } from './Subtitle'

const Player: FC<PlayerProps> = ({
  seek,
  subtitles,
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

  if (position.x === 0) return null

  return (
    <Rnd
      default={{
        x: position.x,
        y: position.y,
        width: 500,
        height: 300,
      }}
      minWidth={500}
      minHeight={300}
      bounds="parent"
      dragHandleClassName="header-draggable"
    >
      <div className={playerStyles.content} style={{ display: shouldShowPlayer ? 'block' : 'none' }}>
          <h1 className={`header-draggable ${playerStyles.header}`}>
            <p>Meow~Ears Up!</p>
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
              <Subtitle playerRef={playerRef} subtitles={subtitles} />
            </div>
          </div>
      </div>
    </Rnd>
  )
}

type PlayerProps = {
  seek: number | null;
  subtitles: SubType[];
  shouldShowPlayer?: boolean;
  hidePlayer: () => void;
  episodeCount: number;
}

export { Player }

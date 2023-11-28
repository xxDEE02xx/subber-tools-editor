'use client'
import React, { FC, useEffect, useState } from 'react'

import playerStyles from './player.module.css'

import { SubType } from '@/types/subtitle'

type SubtitleProps = {
  playerRef: any;
  subtitles: SubType[];
}
type PlayerProps = {
  seek: number | null;
}

const Subtitle: FC<SubtitleProps> = ({ playerRef, subtitles }) => {
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Number(playerRef?.current?.getCurrentTime())

      const matchSubtitle = subtitles.find(subtitle => currentTime >= subtitle.from  && currentTime <= subtitle.to)
      if (matchSubtitle) setValue(matchSubtitle.text)
      else setValue('')
    }, 1000);

    return () => clearInterval(interval)
  }, [playerRef, subtitles])

  return (
    <div className={playerStyles.subWrapper}>
      {value}
    </div>
  )
}

export { Subtitle }

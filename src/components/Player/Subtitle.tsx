'use client'
import React, { FC, useEffect, useState } from 'react'

import playerStyles from './player.module.css'

import { SegmentType } from '@/types/segment'
import { SubtitleType } from '@/types/subtitle'


const Subtitle: FC<SubtitleProps> = ({ playerRef, segments }) => {
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Number(playerRef?.current?.getCurrentTime())

      const matchSegment = segments.find(segment => currentTime >= (segment.startTime / 1000)  && currentTime <= (segment.endTime / 1000))
      if (matchSegment) setValue(matchSegment.subtitle.content)
      else setValue('')
    }, 1000);

    return () => clearInterval(interval)
  }, [playerRef, segments])

  return (
    <div className={playerStyles.subWrapper}>
      {value}
    </div>
  )
}

type SubtitleProps = {
  playerRef: any;
  segments: SegmentType[];
}

export { Subtitle }

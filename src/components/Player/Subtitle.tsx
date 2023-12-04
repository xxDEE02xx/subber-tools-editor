'use client'
import React, { FC, useEffect, useState } from 'react'

import playerStyles from './player.module.css'

import { SegmentType } from '@/types/segment'


const Subtitle: FC<SubtitleProps> = ({ playerRef, segments }) => {
  const [value, setValue] = useState<string>('')

  useEffect(() => {
    const renderSub = () => {
      const currentTime = Number(playerRef?.current?.getCurrentTime())

      const matchSegment = segments.find(segment => currentTime >= (segment.startTime / 1000)  && currentTime <= (segment.endTime / 1000))
      if (matchSegment) setValue(matchSegment.subtitle.content)
      else value && setValue('')
    }
    const interval = setInterval(() => renderSub(), 500);
    renderSub()

    return () => clearInterval(interval)
  }, [playerRef, segments])

  return (
    <>
      <div
        className={playerStyles.subWrapper}
        style={{ color: '#FFFFFF' }}
        dangerouslySetInnerHTML={{
          __html: value.indexOf('🎵') >= 0 ? `♫${value.replaceAll('🎵', '')}♫` : value
        }}
      />
    </>
  )
}

type SubtitleProps = {
  playerRef: any;
  segments: SegmentType[];
}

export { Subtitle }

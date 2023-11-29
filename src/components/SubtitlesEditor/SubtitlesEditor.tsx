'use client'
import React, { FC } from 'react'

import subtitlesEditorStyles from './subtitlesEditor.module.css'

import { Item } from './Item'

const SubtitlesEditor: FC<SubtitlesEditorProps> = ({showAndSeekPlayer}) => {
  return (
    <div className={subtitlesEditorStyles.wrapper}>
      <Item
        showAndSeekPlayer={showAndSeekPlayer}
        data="Val rocks!"
        duration={{from: 30, to: 40}}
      />
      <Item
        showAndSeekPlayer={showAndSeekPlayer}
        data="this is just a teest"
        duration={{from: 60, to: 70}}
      />
    </div>
  )
}

type SubtitlesEditorProps = {
  showAndSeekPlayer: (value: number) => void;
}

export { SubtitlesEditor }

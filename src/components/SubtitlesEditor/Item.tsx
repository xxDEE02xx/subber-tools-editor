'use client'
import React, { FC } from 'react'

import subtitlesEditorStyles from './subtitlesEditor.module.css'

import { Editor } from '@/components/Editor'

function toTimeString(totalSeconds: number) {
  const totalMs = totalSeconds * 1000
  const result = new Date(totalMs).toISOString().slice(11, 19)

  return result
}

const Item: FC<ItemProps> = ({showAndSeekPlayer, duration, data, isDone }) => {
  return (
    <>
      <div className={subtitlesEditorStyles.itemWrapper}>
        <div className={subtitlesEditorStyles.period}>
          <button onClick={() => showAndSeekPlayer(duration.from)}>{toTimeString(duration.from)} - {toTimeString(duration.to)}</button>
        </div>
        {!isDone ? (
          <>
            <div className={subtitlesEditorStyles.editor}>
              <Editor data={data} />
            </div>
            <div className={subtitlesEditorStyles.actions}>
              actions here
            </div>
          </>
        ) : <p className={subtitlesEditorStyles.doneData}>{data}</p>}
      </div>
      <hr className={subtitlesEditorStyles.itemDivider} />
    </>
  )
}

type ItemProps = {
  showAndSeekPlayer: (value: number) => void;
  duration: Record<string, number>;
  data: string;
  isDone: boolean;
}

export { Item }

'use client'
import React, { FC } from 'react'
import Image from 'next/image'

import { Editor } from '@/components/Editor'

import SortIcon from "../../../../public/icons/sort.svg"
import TimeIcon from "../../../../public/icons/time.svg"

import { SuggestionType } from '@/types/suggestion'

import subtitlesEditorStyles from './subtitlesEditor.module.css'


function toTimeString(totalSeconds: number) {
  const totalMs = totalSeconds * 1000
  const result = new Date(totalMs).toISOString().slice(11, 19)

  return result
}

const Item: FC<ItemProps> = ({showAndSeekPlayer, duration, data, completed, suggestions }) => {
  return (
    <>
      <div className={`${subtitlesEditorStyles.itemWrapper} ${completed && subtitlesEditorStyles.itemWrapperCompleted}`}>
        <div className={subtitlesEditorStyles.period}>
          <button onClick={() => showAndSeekPlayer(duration.from)}>{toTimeString(duration.from)} - {toTimeString(duration.to)}</button>
        </div>
        {!completed ? (
          <>
            <div className={subtitlesEditorStyles.editor}>
              <Editor data={data} suggestions={suggestions} />
            </div>
            <div className={subtitlesEditorStyles.actions}>
              <button>
                <Image src={SortIcon} height={20} width={20} alt="sort icon" />
                <span>Paraphrase</span>
              </button>
              <button>
                <Image src={TimeIcon} height={20} width={20} alt="sort icon" />
                <span>Edited versions</span>
              </button>
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
  completed: boolean;
  suggestions?: SuggestionType[];
}

export { Item }

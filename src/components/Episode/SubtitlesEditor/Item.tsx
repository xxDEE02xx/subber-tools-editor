'use client'
import React, { FC, useState } from 'react'
import { ReactSVG } from 'react-svg'
import Tooltip from '@mui/material/Tooltip';
import { ClickAwayListener } from '@mui/base/ClickAwayListener'

import { Editor } from '@/components/Editor'

import { SuggestionType } from '@/types/suggestion'

import { useEpisodeStore } from '@/store/episode'
import { useSegmentStore } from '@/store/segment'

import subtitlesEditorStyles from './subtitlesEditor.module.css'


const toTimeString = (totalSeconds: number) => {
  const totalMs = totalSeconds * 1000
  const result = new Date(totalMs).toISOString().slice(11, 19)

  return result
}

const getSubstring = (text: string, char1: string, char2: string) => {
  return text.slice(
    text.indexOf(char1) + 1,
    text.lastIndexOf(char2),
  );
}

const GetGrammarComparison: FC<{ value: string }> = ({ value }) => {
  const toReplace = getSubstring(value, '[-', '-]').replaceAll('-', '')
  const suggestion = getSubstring(value, '{+', '+}').replace('+', '')

  return (
    <>
      <span className={subtitlesEditorStyles.grammarError}>{toReplace}</span>{' '}
      {value.replaceAll(`\n`, '').length != suggestion.length && <span className={subtitlesEditorStyles.grammarSuggestion}>{suggestion}</span>}
    </>
  )
}

const Item: FC<ItemProps> = ({showAndSeekPlayer, duration, data, completed, suggestions, segmentId, history }) => {
  const [ showDropdown, setShowDropdown ] = useState<string>('')
  const [ isFocus, setIsFocus ] = useState<boolean>(true)
  const [activeEpisodeId] = useEpisodeStore((state) => [
    state.activeEpisodeId,
  ])
  const [updateSubtitle] = useSegmentStore((state) => [
    state.updateSubtitle
  ])

  const onChange = (value: string) => {
    updateSubtitle(activeEpisodeId, segmentId, value)
  }

  const revertValue = (value: string) => {
    updateSubtitle(activeEpisodeId, segmentId, value)
    setShowDropdown('')
  }

  const onSetShowDropdown = (value: string) => {
    setIsFocus(true)
    setTimeout(() => {
      if (showDropdown === value) setShowDropdown('')
      else setShowDropdown(value)
    }, 100)
  }

  const isWithHistory = !!history.length
  const paraphrase = suggestions?.filter(suggestion => ['english_paraphrase', 'english_neutral'].includes(suggestion.type))
  const fixGrammar = suggestions?.find(suggestion => suggestion.type === 'english_fix_grammar')

  let dropdown = {
    icon: '/icons/history.svg',
    label: 'History'
  }
  if (showDropdown === 'suggestions') {
    dropdown = {
      icon: '/icons/history.svg',
      label: 'Suggestions'
    }
  } else if (showDropdown === 'grammar') {
    dropdown = {
      icon: '/icons/edit.svg',
      label: 'Grammar/Spelling'
    }
  }

  return (
    <>
      <div className={`${subtitlesEditorStyles.itemWrapper} ${completed && subtitlesEditorStyles.itemWrapperCompleted}`}>
        <div className={subtitlesEditorStyles.period}>
          <button onClick={() => showAndSeekPlayer(duration.from)}>{toTimeString(duration.from)} - {toTimeString(duration.to)}</button>
        </div>
        {!completed ? (
          <>
            <div className={subtitlesEditorStyles.editor}>
              <Editor
                key={JSON.stringify(history)}
                data={data}
                suggestions={suggestions}
                onChange={onChange}
                history={history}
                setIsFocus={setIsFocus}
                setShowDropdown={onSetShowDropdown}
              />
              {showDropdown && (
                <ClickAwayListener onClickAway={() => setShowDropdown('')}>
                  <div className={subtitlesEditorStyles.history}>
                    <h5>
                      <ReactSVG src={dropdown.icon} />
                      <span>{dropdown.label}</span>
                    </h5>
                    <div className={subtitlesEditorStyles.historyList}>
                      {showDropdown === 'history' ?
                        [...history].reverse().map((text, key) => (
                          <button className={subtitlesEditorStyles.historyItem} onClick={() => revertValue(text)} key={`sub-history-${key}`}>
                            <div className={subtitlesEditorStyles.historyItemUser}>
                              <span className={subtitlesEditorStyles.historyItemUserProfile}></span>
                              <span className={subtitlesEditorStyles.historyItemUserUsername}>Chelsea</span>
                              <span className={subtitlesEditorStyles.historyItemUserTime}>2/2/12 11:39am</span>
                            </div>
                            <p>{text}</p>
                          </button>
                        )) : 
                        showDropdown === 'suggestions' ?
                          paraphrase?.map(suggestion => (
                            <button className={subtitlesEditorStyles.historyItem} onClick={() => revertValue(suggestion.newContent)} key={`sub-suggestions-${suggestion.id}`}>
                              <p>{suggestion.newContent}</p>
                            </button>
                          )) :
                          fixGrammar && <button className={subtitlesEditorStyles.historyItem} onClick={() => revertValue(fixGrammar.newContent)} key={`sub-grammar-1`}>
                            <p>
                              ...<GetGrammarComparison value={fixGrammar.diffContent} />...
                            </p>
                          </button>
                      }
                    </div>
                  </div>
                </ClickAwayListener>
              )}
            </div>
            <div className={subtitlesEditorStyles.actions}>
              {isFocus && (
                <>
                  <button
                    {...(paraphrase || []).length === 0 ? {
                      className: subtitlesEditorStyles.btnDisabled
                    } : {
                      onClick: () => onSetShowDropdown('suggestions')
                    }}
                  >
                    <ReactSVG src="/icons/sort.svg" className={subtitlesEditorStyles.icon} />
                    <span>Paraphrase</span>
                  </button>
                  <Tooltip title={!isWithHistory ? "No edits recorded" : ''} placement="right">
                    <button
                      {...!isWithHistory ? {
                        className: subtitlesEditorStyles.btnDisabled
                      } : {
                        onClick: () => onSetShowDropdown('history')
                      }}
                    >
                      <ReactSVG src="/icons/time.svg" className={subtitlesEditorStyles.icon} />
                      <span>Edited versions</span>
                    </button>
                  </Tooltip>
                </>
              )}
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
  segmentId: number;
  history: string[];
}

export { Item }

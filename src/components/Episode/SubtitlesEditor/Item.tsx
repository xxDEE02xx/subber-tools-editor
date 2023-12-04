'use client'
import React, { FC, useState } from 'react'
import { ReactSVG } from 'react-svg'
import Tooltip from '@mui/material/Tooltip';
import { ClickAwayListener } from '@mui/base/ClickAwayListener'

import { Editor } from '@/components/Editor'

import { SuggestionType } from '@/types/suggestion'

import { useEpisodeStore } from '@/store/episode'
import { useSegmentStore } from '@/store/segment'

import { groupString, getSuggestionReplacement } from '@/helper/suggestion'

import subtitlesEditorStyles from './subtitlesEditor.module.css'

const toTimeString = (totalSeconds: number) => {
  const totalMs = totalSeconds * 1000
  const result = new Date(totalMs).toISOString().slice(11, 19)

  return result
}

const GetGrammarComparison: FC<{ value: string }> = ({ value }) => {
  const collections = groupString(value)

  const contructValue = (val: string) => {
    const { toReplace, suggestion } = getSuggestionReplacement(val)
    if (!toReplace && !suggestion) return val
    else if (toReplace && !suggestion) {
      return <span className={subtitlesEditorStyles.grammarError}>{toReplace}</span>
    }
    else if (!toReplace && suggestion) {
      return <span className={subtitlesEditorStyles.grammarSuggestion}>{suggestion}</span>
    }
    return (
      <>
        <span className={subtitlesEditorStyles.grammarError}>{toReplace}</span>{' '}<span className={subtitlesEditorStyles.grammarSuggestion}>{suggestion}</span>
      </>
    )
  }

  let key = 0
  if (collections.length === 0) return value
  const valueArr: string[] = []
  collections.forEach(collection => {
    if (collection.from > key) {
      valueArr.push(value.slice(key, collection.from).trim())
    }
    valueArr.push(value.slice(collection.from, collection.to+1).trim())
    key = collection.to+1
  })
  if (key < value.length) {
    valueArr.push(value.slice(key, value.length).trim())
  }

  return (
    <>
      {valueArr.map((item, key) => (
        <span key={`suggestion-struct-${key}`}>{contructValue(item)}{' '}</span>
      ))}
    </>
  )
}

const Item: FC<ItemProps> = ({
  showAndSeekPlayer,
  duration,
  data,
  completed,
  suggestions,
  segmentId,
  history,
}) => {
  const [ showDropdown, setShowDropdown ] = useState<string>('')
  const [ isFocus, setIsFocus ] = useState<boolean>(true)
  const [activeEpisodeId] = useEpisodeStore((state) => [
    state.activeEpisodeId,
  ])
  const [updateSubtitle, setSuggestionImplemented] = useSegmentStore((state) => [
    state.updateSubtitle,
    state.setSuggestionImplemented,
  ])

  const onChange = (value: string) => {
    updateSubtitle(activeEpisodeId, segmentId, value)
  }

  const revertValue = (value: string, suggestionId?: number) => {
    updateSubtitle(activeEpisodeId, segmentId, value)
    if (suggestionId) {
      setSuggestionImplemented(activeEpisodeId, segmentId, suggestionId)
    }
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
  const paraphrase = suggestions?.filter(suggestion => ['english_paraphrase', 'english_neutral'].includes(suggestion.type) && !suggestion.isImplemented)
  const fixGrammar = suggestions?.find(suggestion => suggestion.type === 'english_fix_grammar' && !suggestion.isImplemented)

  let dropdown = {
    icon: '/icons/history.svg',
    label: 'History',
  }
  if (showDropdown === 'suggestions') {
    dropdown = {
      icon: '/icons/sort.svg',
      label: 'Suggestions',
    }
  } else if (showDropdown === 'grammar') {
    dropdown = {
      icon: '/icons/edit.svg',
      label: 'Grammar/Spelling',
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
                onSelectSugggestion={(suggestionId: number) => {
                  setSuggestionImplemented(activeEpisodeId, segmentId, suggestionId)
                }}
              />
              {showDropdown && (
                <ClickAwayListener onClickAway={() => setShowDropdown('')}>
                  <div className={subtitlesEditorStyles.history}>
                    <h5>
                      <div>
                        <ReactSVG src={dropdown.icon} className={`${subtitlesEditorStyles.historyLabelIcon} ${showDropdown === 'suggestions' && subtitlesEditorStyles.headerSortIcon}`} />
                        <span>{dropdown.label}</span>
                      </div>
                      {showDropdown !== 'history' && (
                        <button className={subtitlesEditorStyles.headerButton}>
                          <ReactSVG src='/icons/refresh.svg' />
                          Regenerate
                        </button>
                      )}
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
                            <button className={subtitlesEditorStyles.historyItem} onClick={() => revertValue(suggestion.newContent, suggestion.id)} key={`sub-suggestions-${suggestion.id}`}>
                              <p>{suggestion.newContent}</p>
                            </button>
                          )) :
                          fixGrammar && <button className={subtitlesEditorStyles.historyItem} onClick={() => revertValue(fixGrammar.newContent, fixGrammar.id)} key={`sub-grammar-1`}>
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
              <div className={subtitlesEditorStyles.actionsSub}>
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

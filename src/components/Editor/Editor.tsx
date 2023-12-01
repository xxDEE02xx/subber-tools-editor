'use client'
import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image'

import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CuteQcIcon from "../../../public/icons/cutesyqc.svg"

import { SuggestionType } from '@/types/suggestion'

import editorStyles from './editor.module.css'

const getSubstring = (text: string, char1: string, char2: string) => {
  return text.slice(
    text.indexOf(char1) + 1,
    text.lastIndexOf(char2),
  );
}

const Editor: FC<EditorProps> = ({ data, onChange, suggestions, history, setIsFocus, setShowDropdown }) => {
  const [withRecommendation, setWithRecommendation] = useState<boolean>(true)
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: data,
    editorProps: {
      handleClickOn: (view, pos) => {
        const text = view.state.doc.textContent.replaceAll('  ', ' ').trim()
        const wordArr = text.split(' ')

        let value = ''
        let incrementedKey = 0
        for(let i=0; i<= wordArr.length-1; i++) {
          incrementedKey += wordArr[i].length + 1

          if (pos <= incrementedKey) {
            value = wordArr[i]
            break
          }
        }

        setShowDropdown('grammar')
      }
    },
    onBlur: ({ editor }) => {
      const content = editor.state.doc.textContent
      if (onChange && data != content) onChange(content)
      // setIsFocus(false)
    },
    onFocus: () => {
      setIsFocus(true)
    },
    onCreate: ({ editor }) => {
      const withTag = data.indexOf('<i>') >= 0
      const withMusic = data.indexOf('🎵') >= 0
      const withMusicAndTag = data.indexOf('🎵 <i>') >= 0
      
      const constructText = () => {
        if (withMusicAndTag) {
          return `🎵 <i>${editor?.state.doc.textContent.replace('<i>', '').replace('</i>', '').replaceAll('🎵', '').trim()}</i> 🎵`
        } else if (withMusic) {
          return editor?.state.doc.textContent
        } else if (withTag) {
          return `<i>${editor?.state.doc.textContent.replace('<i>', '').replace('</i>', '')}</i>`
        } else {
          return data
        }
      }
      editor?.commands.setContent({
        type: "text",
        text: constructText()
      })
    },
  })

  const onClickSelected = () => {
    const { from, to, empty } = editor?.state.selection as Record<string, any>
    if (empty) {
      return null
    }

    const selectedText = editor?.state.doc.textBetween(from, to, ' ')
    console.log('selectedText: ', selectedText);
  }

  const isFocused = editor?.isFocused
  const editorTextContent = editor?.state.doc.textContent

  useEffect(() => {
    const fixGrammar = suggestions?.find(suggestion => suggestion.type === 'english_fix_grammar')
    if (fixGrammar?.diffContent && editor && history.length === 0) {
      const toReplace = getSubstring(fixGrammar?.diffContent, '[-', '-]').replaceAll('-', '')
      const dataDestruct = data.replace(toReplace, `<strong>${toReplace}</strong>`)

      setTimeout(() => editor.commands.setContent(dataDestruct), 1000)
    }
  }, [editor, suggestions])

  const applyRecommnedation = (newContent: string) => {
    editor?.commands.setContent({
      type: "text",
      text: newContent
    })
    setWithRecommendation(false)
    editor?.commands.focus()
  }

  return (
    <div className={editorStyles.wrapper}>
      {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <button
          onClick={onClickSelected}
        >
          Edit
        </button>
      </BubbleMenu>}
      <EditorContent editor={editor} className={editorStyles.editorContent} />
      <div className={editorStyles.editorCount}>
        {isFocused && `${editorTextContent?.length || 0} / 5000`}
      </div>
      {history.length === 0 && withRecommendation && suggestions &&
        suggestions.filter(suggestion => ['lyric', 'screen_text'].includes(suggestion.type)).map(suggestion => (
          <div className={editorStyles.recommendation} key={`suggestion-${suggestion.segmentId}-${suggestion.id}`}>
            <div className={editorStyles.recommendationLeft}>
              <Image src={CuteQcIcon} height={24} width={24} alt="cute qc icon" />
              <p>
                {suggestion.type === 'lyric' ?
                  'This scene may contain lyrics, please format the sentence using "🎵" symbol' :
                  'This scene may contain flashbacks, please italicise the sentence using “<i>...</i>”'
                }
              </p>
            </div>
            <div className={editorStyles.recommendationRight}>
              <button onClick={() => applyRecommnedation(suggestion.newContent)}>Apply</button>
              <button onClick={() => setWithRecommendation(false)}>Ignore</button>
            </div>
          </div>
        ))}
    </div>
  )
}

interface EditorProps {
  data: string;
  onChange?: (data: string) => void;
  suggestions?: SuggestionType[]
  history: string[]
  setIsFocus: (value: boolean) => void;
  setShowDropdown: (value: string) => void;
}

export { Editor }

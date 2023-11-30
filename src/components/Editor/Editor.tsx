'use client'
import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image'

import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CuteQcIcon from "../../../public/icons/cutesyqc.svg"

import { SuggestionType } from '@/types/suggestion'

import editorStyles from './editor.module.css'

const Editor: FC<EditorProps> = ({ data, onChange, suggestions }) => {
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
        console.log('>>> value: ', value)
      }
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

  // const textContent = editor?.state.doc.textContent
  // useEffect(() => {
  //   console.log('textContent: ', { textContent });
  //   if (textContent) {
  //     if (textContent.indexOf('teest ') < 0) {
  //       editor?.commands.setContent(textContent)
  //     } else {
  //       const withEndSpace = textContent.slice(-1) === ' '
  //       let dataDestruct = textContent.replace('teest', '<strong>teest</strong>')
  //       if (withEndSpace ) dataDestruct += '&nbsp;'
  //       editor?.commands.setContent(dataDestruct)
  //     }
  //   }
  // }, [textContent])
  const isFocused = editor?.isFocused
  const editorTextContent = editor?.state.doc.textContent

  useEffect(() => {
    const dataDestruct = data.replace('teest', '<strong>teest</strong>')
    editor?.commands.setContent(dataDestruct)
  }, [editor])

  const applyRecommnedation = () => {
    const text = `🎵 ${editor?.state.doc.textContent} 🎵`
    editor?.commands.setContent(text)
    setWithRecommendation(false)
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
      {withRecommendation && suggestions && suggestions.map(suggestion => (
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
            <button onClick={applyRecommnedation}>Apply</button>
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
}

export { Editor }

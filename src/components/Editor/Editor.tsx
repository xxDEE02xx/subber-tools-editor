'use client'
import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image'

import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CuteQcIcon from "../../../public/icons/cutesyqc.svg"

import { SuggestionType } from '@/types/suggestion'

import { groupString, getSubstring, replaceAtIndex } from '@/helper/suggestion'

import editorStyles from './editor.module.css'


const Editor: FC<EditorProps> = ({
  data,
  onChange,
  suggestions,
  history,
  setIsFocus,
  setShowDropdown,
  onSelectSugggestion,
}) => {
  const [withRecommendation, setWithRecommendation] = useState<boolean>(true)
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: data,
    editorProps: {
      handleClickOn: (view, pos) => {
        const fixGrammar = suggestions?.find(suggestion => suggestion.type === 'english_fix_grammar' && !suggestion.isImplemented)
        if (fixGrammar) {
          // const text = view.state.doc.textContent.replaceAll('  ', ' ').trim()
          // const wordArr = text.split(' ')

          // let value = ''
          // let incrementedKey = 0
          // for(let i=0; i<= wordArr.length-1; i++) {
          //   incrementedKey += wordArr[i].length + 1

          //   if (pos <= incrementedKey) {
          //     value = wordArr[i]
          //     break
          //   }
          // }
          setShowDropdown('grammar')
        }
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
      const withMusic = data.indexOf('♫') >= 0 || data.indexOf('🎵') >= 0
      const withMusicAndTag = data.indexOf('♫ <i>') >= 0 || data.indexOf('🎵 <i>') >= 0
      
      const constructText = () => {
        if (withMusicAndTag) {
          return `♫ <i>${editor?.state.doc.textContent.replace('<i>', '').replace('</i>', '').replaceAll('♫', '').replaceAll('🎵', '').trim()}</i> ♫`
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
    const fixGrammar = suggestions?.find(suggestion => suggestion.type === 'english_fix_grammar' && !suggestion.isImplemented)
    if (fixGrammar?.diffContent && editor && history.length === 0) {
      const collections = groupString(fixGrammar?.diffContent)
      const toReplace = getSubstring(fixGrammar?.diffContent, '[-', '-]').replaceAll('-', '')

      if (toReplace && toReplace.length <= data.length) {
        const dataDestruct = replaceAtIndex(data, collections[0].from, toReplace)
        // const dataDestruct = data.replace(toReplace, `<strong>${toReplace}</strong>`)

        setTimeout(() => editor.commands.setContent(dataDestruct), 1000)
      }
    }
  }, [editor, suggestions])

  const applyRecommnedation = (type: string, id: number) => {
    onSelectSugggestion(id)
    let newContent = `<i>${editor?.state.doc.textContent || ''}</i>`

    if (type === 'lyric') {
      newContent = `🎵 ${newContent} 🎵`
    }

    editor?.commands.setContent({
      type: "text",
      text: newContent
    })
    if (onChange) onChange(newContent)
    setWithRecommendation(false)
  }

  const filteredSuggestions = suggestions?.filter(suggestion => ['lyric', 'screen_text'].includes(suggestion.type) && !suggestion.isImplemented)

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
      {withRecommendation && suggestions && filteredSuggestions && filteredSuggestions.length > 0 &&
        filteredSuggestions.map(suggestion => (
          <div className={`${editorStyles.recommendation} ${suggestion.type !== 'lyric' ? editorStyles.lyrics : ''}`} key={`suggestion-${suggestion.segmentId}-${suggestion.id}`}>
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
              <button onClick={() => applyRecommnedation(suggestion.type, suggestion.id)}>Apply</button>
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
  onSelectSugggestion: (id: number) => void;
}

export { Editor }

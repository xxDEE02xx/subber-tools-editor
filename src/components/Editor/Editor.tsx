'use client'
import React, { FC, useEffect, useState } from 'react'

import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import editorStyles from './editor.module.css'

const Editor: FC<EditorProps> = ({ data, onChange }) => {
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

  useEffect(() => {
    const dataDestruct = data.replace('teest', '<strong>teest</strong>')
    editor?.commands.setContent(dataDestruct)
  }, [editor])

  return (
    <div className={editorStyles.wrapper}>
      {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <button
          onClick={onClickSelected}
        >
          Edit
        </button>
      </BubbleMenu>}
      <EditorContent editor={editor} />
    </div>
  )
}

interface EditorProps {
  data: string
  onChange?: (data: string) => void
}

export { Editor }

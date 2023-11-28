'use client'

import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography'

import pageStyles from '@/styles/page.module.css'

import { Editor } from '@/components/Editor'
import { Player } from '@/components/Player'

import { SubType } from '@/types/subtitle'

export default function Home() {
  const [seek, setSeek] = useState<number | null>(null)
  const [subtitles, setSubtitles] = useState<SubType[]>([])

  useEffect(() => {
    setSubtitles([
      {
        from: 0,
        to: 3,
        text: 'This is a sample subtitle',
      },
      {
        from: 4,
        to: 8,
        text: 'hahaha',
      },
      {
        from: 11,
        to: 20,
        text: '♫ The quick brown fox jumps over the lazy dog. ♫',
      },
      {
        from: 30,
        to: 35,
        text: '♫ yoyoyoyoyoyo. ♫',
      },
      {
        from: 60,
        to: 65,
        text: 'subber tools',
      }
    ])
  }, [])

  return (
    <div className={pageStyles.container}>
      <div>
        <Typography variant="h4">Welcome to Viki Subber Tools for Editor</Typography>
      </div>

      Seek:{' '}
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button onClick={() => setSeek(30)}>30</Button>
        <Button onClick={() => setSeek(60)}>60</Button>
        <Button onClick={() => setSeek(90)}>90</Button>
      </ButtonGroup>

      <Editor data="this is just a teest" />
      <Player seek={seek} subtitles={subtitles} />
    </div>
  )
}

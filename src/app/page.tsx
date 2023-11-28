'use client'

import React, { useState } from 'react'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography'

import pageStyles from '@/styles/page.module.css'

import { Editor } from '@/components/Editor'
import { Player } from '@/components/Player'

export default function Home() {
  const [seek, setSeek] = useState<number | null>(null)

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
        <Button onClick={() => setSeek(120)}>120</Button>
      </ButtonGroup>

      <Editor data="this is just a teest" />
      <Player seek={seek} />
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'

import pageStyles from '@/styles/page.module.css'

import { Player } from '@/components/Player'
import { MenuBar } from '@/components/MenuBar'
import { SideBar } from '@/components/SideBar'
import { Episode } from '@/components/Episode'

import { SubType } from '@/types/subtitle'
import { EpisodeType } from '@/types/episode'

const Subtitles = [
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
]

const Episodes = [
  {
    id: 1,
    title: 'Episode 1',
    parts: [
      {id: 1, isDone: false, title: 'Part 1'},
      {id: 2, isDone: false, title: 'Part 2'},
      {id: 3, isDone: false, title: 'Part 3'}
    ]
  },
  {
    id: 2,
    title: 'Episode 2',
    parts: [
      {id: 1, isDone: false, title: 'Part 1'},
      {id: 2, isDone: false, title: 'Part 2'},
      {id: 3, isDone: false, title: 'Part 3'}
    ]
  },
]

export default function Home() {
  const [seek, setSeek] = useState<number | null>(null)
  const [subtitles, setSubtitles] = useState<SubType[]>([])
  const [episodes, setEpisodes] = useState<EpisodeType[]>([])
  const [selectedEpisodeKey, setSelectedEpisodeKey] = useState<number | null>(null)
  const [shouldShowPlayer, setShouldShowPlayer] = useState<boolean>(false)

  useEffect(() => {
    setSubtitles(Subtitles)
  }, [])

  useEffect(() => {
    setEpisodes(Episodes)
    setSelectedEpisodeKey(0)
  }, [])

  const showAndSeekPlayer = (value: number) => {
    setShouldShowPlayer(true)
    setSeek(value)
  }

  const setDone = (episodeId: number, partId: number): void => {
    if (selectedEpisodeKey !== null) {
      const updatedEpisodes = episodes.map(episode => {
        if (episode.id === episodeId) {
          episode.parts = episode.parts.map(part => {
            if (part.id === partId) {
              part.isDone = true
            }
            return part
          })
        }
        return episode
      })

      const activeEpisode = episodes.find(episode => episode.id === episodeId) as EpisodeType
      const activeEpisodePartsDone = activeEpisode.parts.filter(part => part.isDone)
      setEpisodes(updatedEpisodes)
      if (activeEpisode.parts.length === activeEpisodePartsDone.length) {
        if (selectedEpisodeKey < (episodes.length - 1)) {
          setSelectedEpisodeKey(selectedEpisodeKey + 1)
        }
      }
    }
  }

  return (
    <>
      <MenuBar />
      {selectedEpisodeKey !== null && (
        <>
          <SideBar episodes={episodes} selectedEpisodeKey={selectedEpisodeKey} />
          <div className={pageStyles.container}>
            <Episode episode={episodes[selectedEpisodeKey]} setDone={setDone} showAndSeekPlayer={showAndSeekPlayer} />
            <Player
              seek={seek}
              subtitles={subtitles}
              shouldShowPlayer={shouldShowPlayer}
              hidePlayer={() => setShouldShowPlayer(false)}
              episodeCount={selectedEpisodeKey+1}
            />
          </div>
        </>
      )}
    </>
  )
}

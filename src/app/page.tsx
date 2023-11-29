'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Fade from '@mui/material/Fade'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import ButtonBase from '@mui/material/ButtonBase'

import BlobbyLokiIcon from "../../public/icons/blobbyLoki.svg"
import CloseIcon from "../../public/icons/close.svg"

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
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null)
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null)
  const [shouldShowPlayer, setShouldShowPlayer] = useState<boolean>(false)
  const [openWelcome, setOpenWelcome] = useState<boolean>(false)

  useEffect(() => {
    setSubtitles(Subtitles)
  }, [])

  useEffect(() => {
    setEpisodes(Episodes)
    setSelectedEpisodeId(Episodes[0].id)
    setSelectedPartId(Episodes[0].parts[0].id)
  }, [])

  useEffect(() => {
    setOpenWelcome(true)
  }, [])

  const showAndSeekPlayer = (value: number) => {
    setShouldShowPlayer(true)
    setSeek(value)
  }

  const setUnDone = (episodeId: number, partId: number): void => {
    if (selectedEpisodeId !== null) {
      const updatedEpisodes = episodes.map(episode => {
        if (episode.id === episodeId) {
          episode.parts = episode.parts.map(part => {
            if (part.id === partId) {
              part.isDone = false
            }
            return part
          })
        }
        return episode
      })

      setEpisodes(updatedEpisodes)
    }
  }

  const setDone = (episodeId: number, partId: number): void => {
    if (selectedEpisodeId !== null) {
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
        let isFound = false
        const nextEpisode = episodes.filter(episode => {
          if (isFound) return true
          if (episode.id === episodeId) isFound = true
          return false
        })

        if (nextEpisode.length > 0) {
          setSelectedEpisodeId(nextEpisode[0].id)
          setSelectedPartId(nextEpisode[0].parts[0].id)
        }
      } else {
        const notDoneParts = activeEpisode.parts.filter(part => !part.isDone)
        if (notDoneParts.length > 0) setSelectedPartId(notDoneParts[0].id)
      }
    }
  }

  const onSelectPart = (episodeId: number, partId: number) => {
    setSelectedEpisodeId(episodeId)
    setSelectedPartId(partId)
  }

  const selectedEpisode = episodes.find(episode => episode.id === selectedEpisodeId) as EpisodeType

  const isAllDone = !episodes.find(episode => {
    return !!episode.parts.find(part => !part.isDone)
  })

  return (
    <>
      <MenuBar />
      {selectedEpisodeId !== null && selectedPartId !== null && (
        <>
          <SideBar episodes={episodes} selectedEpisodeId={selectedEpisodeId} onClick={onSelectPart} />
          <div className={pageStyles.container}>
            <Episode
              episode={selectedEpisode}
              selectedPartId={selectedPartId}
              setDone={setDone}
              setUnDone={setUnDone}
              showAndSeekPlayer={showAndSeekPlayer}
              isAllDone={isAllDone}
            />
            <Player
              seek={seek}
              subtitles={subtitles}
              shouldShowPlayer={shouldShowPlayer}
              hidePlayer={() => setShouldShowPlayer(false)}
              episodeCount={selectedEpisodeId}
            />
          </div>
        </>
      )}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openWelcome}
        onClose={() => setOpenWelcome(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openWelcome}>
          <div className={pageStyles.modal}>
            <span className={pageStyles.modalClose} onClick={() => setOpenWelcome(false)}>
              <Image src={CloseIcon} width={11} height={11} alt="close modal" />
            </span>
            <Image src={BlobbyLokiIcon} height={85} width={89} alt="blobby check" />
            <p className={pageStyles.modalTitle}>
              Meet Loki, your personal editor sidekick!
            </p>
            <p className={pageStyles.modalMessage}>
              In this fresh space, you’ll get smart suggestions from Loki<br />to make faster and better EN edits
            </p>
            <ButtonBase onClick={() => setOpenWelcome(false)}>
              Start Editing!
            </ButtonBase>
            <a href="https://subber.viki.com/translations/1240611">
              Back to Subber Tool
            </a>
          </div>
        </Fade>
      </Modal>
    </>
  )
}

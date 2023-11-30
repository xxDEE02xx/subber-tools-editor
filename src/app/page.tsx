'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ButtonBase from '@mui/material/ButtonBase'

import BlobbyLokiIcon from "../../public/icons/blobbyLoki.svg"

import pageStyles from '@/styles/page.module.css'

import { Player } from '@/components/Player'
import { MenuBar } from '@/components/MenuBar'
import { SideBar } from '@/components/SideBar'
import { Episode } from '@/components/Episode'
import { Modal } from '@/components/Modal'

import { useEpisodeStore } from '@/store/episode'
import { useSubtitleStore } from '@/store/subtitle'

export default function Home() {
  const [seek, setSeek] = useState<number | null>(null)
  const [shouldShowPlayer, setShouldShowPlayer] = useState<boolean>(false)
  const [openWelcome, setOpenWelcome] = useState<boolean>(false)

  const [episodes, activeEpisodeId] = useEpisodeStore((state) => [
    state.episodes,
    state.activeEpisodeId,
    state.activePartId,
  ])

  const [subtitles] = useSubtitleStore((state) => [
    state.subtitles,
  ])

  useEffect(() => {
    setOpenWelcome(true)
  }, [])

  const showAndSeekPlayer = (value: number) => {
    setShouldShowPlayer(true)
    setSeek(value)
  }

  return (
    <>
      <MenuBar />
      {episodes && (
        <>
          <SideBar />
          <div className={pageStyles.container}>
            <Episode
              showAndSeekPlayer={showAndSeekPlayer}
            />
            <Player
              seek={seek}
              subtitles={subtitles}
              shouldShowPlayer={shouldShowPlayer}
              hidePlayer={() => setShouldShowPlayer(false)}
              episodeCount={activeEpisodeId}
            />
          </div>
        </>
      )}
      <Modal isOpen={openWelcome}>
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
      </Modal>
    </>
  )
}

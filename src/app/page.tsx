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

import { useEpisodeStore, mapPartData } from '@/store/episode'
import { useSegmentStore, mapSegmentData } from '@/store/segment'

import { useFetch } from "@/store/useFetch"

export default function Home() {
  const [seek, setSeek] = useState<number | null>(null)
  const [shouldShowPlayer, setShouldShowPlayer] = useState<boolean>(false)
  const [openWelcome, setOpenWelcome] = useState<boolean>(false)

  const episode1Parts = useFetch("http://localhost:8080/v4/videos/1240611v/parts.json")
  const episode2Parts = useFetch("http://localhost:8080/v4/videos/1244150v/parts.json")
  const segment1 = useFetch("http://localhost:8080/v4/videos/1240611v/segments.json")
  const segment2 = useFetch("http://localhost:8080/v4/videos/1244150v/segments.json")

  const [episodes, activeEpisodeId, activePartId, setEpisodes, setActivePartId] = useEpisodeStore((state) => [
    state.episodes,
    state.activeEpisodeId,
    state.activePartId,
    state.setEpisodes,
    state.setActivePartId,
  ])

  const [segments, setSegments] = useSegmentStore((state) => [
    state.segments,
    state.setSegments,
  ])

  useEffect(() => {
    setOpenWelcome(true)
  }, [])

  useEffect(() => {
    if (episode1Parts && episode2Parts) {
      const newEpisodes = episodes.map(episode => {
        const completed = episode.id === 1 ? true : false
        return {
          ...episode,
          parts: (episode.id === 1 ? 
            (episode1Parts as any).video_parts : 
            (episode2Parts as any).video_parts as []).map((part: Record<string, any>) => mapPartData(part, completed))
        }
      })
      setEpisodes(newEpisodes)
      setActivePartId((episode2Parts as any).video_parts[0].id)
    }
  }, [episode1Parts, episode2Parts]);

  useEffect(() => {
    if (segment1 && segment2) {
      setSegments({
        1: (segment1 as any).segments.map((segment: any) => mapSegmentData(segment)),
        2: (segment2 as any).segments.map((segment: any) => mapSegmentData(segment)),
      })
    }
  }, [segment1, segment2]);

  const showAndSeekPlayer = (value: number) => {
    setShouldShowPlayer(true)
    setSeek(value)
  }

  return (
    <>
      <MenuBar />
      {episodes && segments && activePartId && (
        <>
          <SideBar />
          <div className={pageStyles.container}>
            <Episode
              showAndSeekPlayer={showAndSeekPlayer}
            />
            <Player
              seek={seek}
              shouldShowPlayer={shouldShowPlayer}
              hidePlayer={() => setShouldShowPlayer(false)}
              episodeCount={activeEpisodeId}
            />
          </div>
        </>
      )}
      <Modal isOpen={openWelcome} onClose={() => setOpenWelcome(false)}>
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

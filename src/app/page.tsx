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
import { useSegmentStore } from '@/store/segment'

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

  const [subtitles] = useSubtitleStore((state) => [
    state.subtitles,
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
        return {
          ...episode,
          parts: (episode.id === 1 ? (episode1Parts as any).video_parts : (episode2Parts as any).video_parts as []).map((part: Record<string, any>) => ({
            id: part.id,
            completed: part.completed,
            title: `Part ${part.number}`,
            startTime: part.start_time,
            endTime: part.end_time,
            number: part.number,
          }))
        }
      })
      setEpisodes(newEpisodes)
      setActivePartId((episode1Parts as any).video_parts[0].id)
    }
  }, [episode1Parts, episode2Parts]);

  useEffect(() => {
    if (segment1 && segment2) {
      setSegments({
        1: (segment1 as any).segments.map((segment: any) => ({
            id: segment.id,
            userId: segment.user_id,
            videoId: segment.video_id,
            startTime: segment.start_time,
            endTime: segment.end_time,
            subtitle: {
              id: segment.subtitle.id,
              userId: segment.subtitle.user_id,
              videoId: segment.subtitle.video_id,
              segmentId: segment.subtitle.segment_id,
              languageCode: segment.subtitle.language_code,
              content: segment.subtitle.content,
            },
            suggestions: segment.subtitle_suggestions && segment.subtitle_suggestions.map((suggestion: any) => ({
              id: suggestion.id,
              segmentId: suggestion.segment_id,
              subtitleId: suggestion.subtitle_id,
              type: suggestion.type,
            })),
          })),
        2: (segment2 as any).segments.map((segment: any) => ({
          id: segment.id,
          userId: segment.user_id,
          videoId: segment.video_id,
          startTime: segment.start_time,
          endTime: segment.end_time,
          subtitle: {
            id: segment.subtitle.id,
            userId: segment.subtitle.user_id,
            videoId: segment.subtitle.video_id,
            segmentId: segment.subtitle.segment_id,
            languageCode: segment.subtitle.language_code,
            content: segment.subtitle.content,
          },
          suggestions: segment.subtitle_suggestions && segment.subtitle_suggestions.map((suggestion: any) => ({
            id: suggestion.id,
            segmentId: suggestion.segment_id,
            subtitleId: suggestion.subtitle_id,
            type: suggestion.type,
          })),
        })),
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

'use client'
import { FC } from 'react'
import Image from 'next/image'

import sidebarStyles from './sidebar.module.css'

import CheckboxIcon from "../../../public/icons/checkbox.svg"
import CheckboxEmptyIcon from "../../../public/icons/checkboxEmpty.svg"
import BackIcon from "../../../public/icons/back.svg"

import { useEpisodeStore } from '@/store/episode'

import { PartType } from '@/types/episode'

import { Accordion } from '@/components/Accordion'

const List: FC<ListProps> = ({ items, episodeId, onClick }) => {
  const [activeEpisodeId, activePartId] = useEpisodeStore((state) => [
    state.activeEpisodeId,
    state.activePartId
  ])
  return (
    <ul>
      {items.map((item: PartType, key) => (
        <li
          key={`list-${episodeId}-${key}`}
          className={`${sidebarStyles.listItem} ${episodeId === activeEpisodeId && item.id === activePartId && sidebarStyles.listItemActive}`}
          onClick={() => onClick(episodeId, item.id)}
        >
          <Image src={item.completed ? CheckboxIcon : CheckboxEmptyIcon} height={16} width={15} alt="email icon" />{item.title}
        </li>
      ))}
    </ul>
  )
}

const SideBar: FC = () => {
  const [episodes, setActiveEpisodeId, setActivePartId] = useEpisodeStore((state) => [
    state.episodes,
    state.setActiveEpisodeId,
    state.setActivePartId,
  ])

  const onClick = (episodeId: number, partId: number) => {
    setActiveEpisodeId(episodeId)
    setActivePartId(partId)
  }

  return (
    <div className={sidebarStyles.wrapper}>
      <div className={sidebarStyles.show}>Show</div>
      <div className={sidebarStyles.title}>Meow~Ears Up!</div>
      <ul className={sidebarStyles.nav}>
        <li>Team notes</li>
        <li>Editing shortcuts</li>
      </ul>
      <hr className={sidebarStyles.divider} />
      {episodes.map((episode, key) => {
        const countParts = episode.parts.length
        const countDoneParts = episode.parts.filter(part => part.completed).length
        const progress = (countDoneParts / countParts) * 100
        return (
          <Accordion key={`episode-${episode.id}`} isOpen={true} title={episode.title} progress={progress}>
            <List episodeId={episode.id} items={episode.parts} onClick={onClick} />
          </Accordion>
        )
      })}
      <div className={sidebarStyles.backToSubberTools}>
        <a href="https://subber.viki.com/translations/1240611">
          <Image src={BackIcon} height={16} width={15} alt="back icon" />
          <span>Back to Subber Tool</span>
        </a>
      </div>
    </div>
  )
}

type ListProps = {
  episodeId: number;
  items: PartType[];
  onClick: (episodeId: number, partId: number) => void
}

export { SideBar }

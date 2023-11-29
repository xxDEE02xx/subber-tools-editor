'use client'
import { FC } from 'react'
import Image from 'next/image'

import sidebarStyles from './sidebar.module.css'

import CheckboxIcon from "../../../public/icons/checkbox.svg"
import CheckboxEmptyIcon from "../../../public/icons/checkboxEmpty.svg"
import BackIcon from "../../../public/icons/back.svg"

import { EpisodeType, PartType } from '@/types/episode'

import { Accordion } from '@/components/Accordion'

const List: FC<ListProps> = ({ items, id }) => {
  return (
    <ul>
      {items.map((item: PartType, key) => (
        <li key={`list-${id}-${key}`} className={sidebarStyles.listItem}>
          <Image src={item.isDone ? CheckboxIcon : CheckboxEmptyIcon} height={16} width={15} alt="email icon" />{item.title}
        </li>
      ))}
    </ul>
  )
}

const SideBar: FC<SideBarProps> = ({ episodes, selectedEpisodeKey }) => {
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
        const countDoneParts = episode.parts.filter(part => part.isDone).length
        const progress = (countDoneParts / countParts) * 100
        return (
          <Accordion key={`episode-${episode.id}`} isOpen={key <= selectedEpisodeKey} title={episode.title} progress={progress}>
            <List id={episode.id} items={episode.parts} />
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
  id: number;
  items: PartType[];
}

type SideBarProps = {
  episodes: EpisodeType[];
  selectedEpisodeKey: number;
}

export { SideBar }

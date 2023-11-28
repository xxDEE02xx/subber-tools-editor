'use client'
import { FC, useState, useRef } from 'react'
import Image from 'next/image'
import ButtonBase from '@mui/material/ButtonBase'
import Popper from '@mui/material/Popper'
import Paper from '@mui/material/Paper'
import Fade from '@mui/material/Fade'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'

import ProfileUser1 from "../../../public/icons/profile.svg"
import ExpandIcon from "../../../public/icons/expand.svg"

import episodeStyles from './episode.module.css'

import { EpisodeType } from '@/types/episode'

const OptionUsers = ['Username 1', 'Username 2', 'Username 3']

const Episode: FC<EpisodeProps> = ({ episode, setDone }) => {
  const selectedPart = episode.parts.find(part => !part.isDone)
  const lastPart = episode.parts[episode.parts.length - 1]
  const [openAssigned, setOpenAssigned] = useState<boolean>(false)
  const [assignedRef, setAssignedRef] = useState<null | HTMLElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const onClickDone = () => {
    if (selectedPart) setDone(episode.id, selectedPart.id)
  }

  const toggleOpenAssigned = (event: React.MouseEvent<HTMLElement>) => {
    setAssignedRef(event.currentTarget);
    setOpenAssigned(value => !value)
  }

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpenAssigned(false);
  };

  return (
    <div className={episodeStyles.wrapper}>
      <div className={episodeStyles.header}>
        <div className={episodeStyles.headerLeft}>
          <h4 className={episodeStyles.title}>{episode.title} {selectedPart?.title || lastPart.title}</h4>
         {selectedPart && <ButtonBase onClick={onClickDone}>Done</ButtonBase>}
        </div>
        <div className={episodeStyles.headerRight}>
          <label>Assigned to</label>
          <div>
              <ButtonBase onClick={toggleOpenAssigned}>
                <Image src={ProfileUser1} height={24} width={24} alt="User 1 Profile" />
                <Image src={ExpandIcon} height={16} width={16} alt="expand icon" style={{ marginLeft: '8px' }} />
              </ButtonBase>
              <Popper
                open={openAssigned}
                anchorEl={assignedRef}
                placement="bottom-end"
                transition
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                      <MenuList id="split-button-menu" autoFocusItem>
                        {OptionUsers.map((option, index) => (
                          <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={(event) => handleMenuItemClick(event, index)}
                          >
                            <Image src={ProfileUser1} height={24} width={24} alt="User 1 Profile" style={{ marginRight: '16px'}} /> {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Paper>
                  </Fade>
                )}
              </Popper>
          </div>
        </div>
      </div>
    </div>
  )
}

type EpisodeProps = {
  episode: EpisodeType;
  setDone: (episodeId: number, partId: number) => void;
}

export { Episode }
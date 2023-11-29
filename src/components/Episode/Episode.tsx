'use client'
import { FC, useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import ButtonBase from '@mui/material/ButtonBase'
import Popper from '@mui/material/Popper'
import Paper from '@mui/material/Paper'
import Fade from '@mui/material/Fade'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'

import ProfileUser1 from "../../../public/icons/profile.svg"
import ExpandIcon from "../../../public/icons/expand.svg"
import UpIcon from "../../../public/icons/up.svg"
import BlobbySuccessIcon from "../../../public/icons/blobbySuccess.svg"
import BlobbyCheckIcon from "../../../public/icons/blobbyCheck.svg"
import ForwardArrowIcon from "../../../public/icons/forwardArrow.svg"
import CloseIcon from "../../../public/icons/close.svg"

import episodeStyles from './episode.module.css'

import { EpisodeType } from '@/types/episode'

import { SubtitlesEditor } from '@/components/SubtitlesEditor'

const OptionUsers = ['Username 1', 'Username 2', 'Username 3']

const Episode: FC<EpisodeProps> = ({ episode, setDone, showAndSeekPlayer }) => {
  const contentRef = useRef(null)
  const selectedPart = episode.parts.find(part => !part.isDone)
  const lastPart = episode.parts[episode.parts.length - 1]
  const [openAssigned, setOpenAssigned] = useState<boolean>(false)
  const [assignedRef, setAssignedRef] = useState<null | HTMLElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [showTopBtn, setShowTopBtn] = useState<boolean>(false)
  const [openConfirmDone, setOpenConfirmDone] = useState(false)
  const [openAllDone, setOpenAllDone] = useState(false)

  const onClickDone = () => {
    setOpenConfirmDone(true)
  }

  const onConfirmDone = () => {
    setOpenConfirmDone(false)
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
    setSelectedIndex(index)
    setOpenAssigned(false)
  }

  const onScrollTop = () => {
    (contentRef?.current as any).scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    if (!selectedPart) {
      setTimeout(() => setOpenAllDone(true), 500)
    }
  }, [selectedPart])

  useEffect(() => {
    (contentRef?.current as any).addEventListener('scroll', () => {
      if ((contentRef?.current as any).scrollTop > 200) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

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
      <div className={episodeStyles.subtitlesWrapper} ref={contentRef}>
        <SubtitlesEditor showAndSeekPlayer={showAndSeekPlayer} />
        {selectedPart && (
          <div className={episodeStyles.doneFooter}>
            <Image src={BlobbySuccessIcon} height={64} width={98} alt="blobby success" />
            <p>Woohoo! You’ve reached the end of Part {selectedPart?.id}!</p>
            <ButtonBase onClick={onClickDone}>Mark done</ButtonBase>
          </div>
        )}
        {showTopBtn && <div className={episodeStyles.goUp} onClick={onScrollTop}><Image src={UpIcon} height={20} width={20} alt="up icon" /></div>}
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openConfirmDone}
        onClose={() => setOpenConfirmDone(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openConfirmDone}>
          <div className={episodeStyles.modal}>
            <span className={episodeStyles.modalClose} onClick={() => setOpenConfirmDone(false)}>
              <Image src={CloseIcon} width={11} height={11} alt="close modal" />
            </span>
            <Image src={BlobbyCheckIcon} height={77} width={109} alt="blobby check" />
            <p className={episodeStyles.modalTitle}>
              Done! You finished editing Part {selectedPart?.id} within 10mins
            </p>
            <p className={episodeStyles.modalMessage}>
              Blobby is happy to help you make more efficient edits,<br />keep up the quality work!
            </p>
            <ButtonBase onClick={onConfirmDone}>
              Continue next part
              <Image src={ForwardArrowIcon} height={24} width={24} alt="blobby check" />
            </ButtonBase>
          </div>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAllDone}
        onClose={() => setOpenAllDone(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openAllDone}>
          <div className={episodeStyles.modal}>
            <span className={episodeStyles.modalClose} onClick={() => setOpenAllDone(false)}>
              <Image src={CloseIcon} width={11} height={11} alt="close modal" />
            </span>
            <Image src={BlobbyCheckIcon} height={77} width={109} alt="blobby check" />
            <p className={episodeStyles.modalTitle}>
              Hoorah! All episodes of Marry Me are edited
            </p>
            <p className={episodeStyles.modalMessage}>
              Blobby is already excited to hop on your next editing<br />journey!
            </p>
            <ButtonBase>
              Share this milestone with the Team!
            </ButtonBase>
            <a href="https://subber.viki.com/translations/1240611">
              Back to Subber Tool
            </a>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

type EpisodeProps = {
  episode: EpisodeType;
  setDone: (episodeId: number, partId: number) => void;
  showAndSeekPlayer: (value: number) => void;
}

export { Episode }
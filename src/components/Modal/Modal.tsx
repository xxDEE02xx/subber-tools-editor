'use client'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import Image from 'next/image'
import ButtonBase from '@mui/material/ButtonBase'
import Fade from '@mui/material/Fade'
import Backdrop from '@mui/material/Backdrop'
import ModalComp from '@mui/material/Modal'

import CloseIcon from "../../../public/icons/close.svg"

import modalStyles from './modal.module.css'

const Modal: FC<ModalProps>= ({ isOpen, children  }) => {
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    setOpen(!!isOpen)
  }, [isOpen])

  return (
    <ModalComp
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <div className={modalStyles.modal}>
          <span className={modalStyles.modalClose} onClick={() => setOpen(false)}>
            <Image src={CloseIcon} width={11} height={11} alt="close modal" />
          </span>
          {children}
        </div>
      </Fade>
    </ModalComp>
  )
}

type ModalProps = {
  isOpen?: boolean;
  children: any
}

export { Modal }
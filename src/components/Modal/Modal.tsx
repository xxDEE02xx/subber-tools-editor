'use client'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import Image from 'next/image'
import ButtonBase from '@mui/material/ButtonBase'
import Fade from '@mui/material/Fade'
import Backdrop from '@mui/material/Backdrop'
import ModalComp from '@mui/material/Modal'

import CloseIcon from "../../../public/icons/close.svg"

import modalStyles from './modal.module.css'

const Modal: FC<ModalProps>= ({ isOpen, children, onClose  }) => {
  return (
    <ModalComp
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={!!isOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={!!isOpen}>
        <div className={modalStyles.modal}>
          <span className={modalStyles.modalClose} onClick={onClose}>
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
  children: any;
  onClose: () => void;
}

export { Modal }

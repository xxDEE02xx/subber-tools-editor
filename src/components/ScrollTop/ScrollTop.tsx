'use client'
import React, { FC, useState, useEffect, MutableRefObject } from 'react'
import Image from 'next/image'

import UpIcon from "../../../public/icons/up.svg"

import scrollTopStyles from './scrolltop.module.css'

const ScrollTop: FC<ScrollTopProps> = ({ contentRef, onScrollTop }: any) => {
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    (contentRef?.current as any).addEventListener('scroll', () => {
      if ((contentRef?.current as any).scrollTop > 200) {
        setOpen(value => !value ? true : value);
      }
      if ((contentRef?.current as any).scrollTop < 200) {
        setOpen(value => value ? false : value);
      }
    });
  }, []);

  if (!open) return null

  return (
    <div className={scrollTopStyles.goUp} onClick={onScrollTop}>
      <Image src={UpIcon} height={20} width={20} alt="up icon" />
    </div>
  )
}

type ScrollTopProps = {
  contentRef: any;
  onScrollTop: () => void;
}

export { ScrollTop }
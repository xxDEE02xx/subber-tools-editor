'use client'
import React, { FC, useState, useEffect } from 'react'

import scrollTopStyles from './scrolltop.module.css'

const ScrollTop: FC = ({ contentRef }: any) => {
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
  return null
  // return (
  //   <div className={scrollTopStyles.goUp} onClick={onScrollTop}><Image src={UpIcon} height={20} width={20} alt="up icon" />
  // )
}

export { ScrollTop }
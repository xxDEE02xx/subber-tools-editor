import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import CircularProgress from '@mui/material/CircularProgress';

import accordionStyles from './accordion.module.css'

import ArrowIcon from "../../../public/icons/arrow.svg"

type ContentToggleProps = {
  title: string
  children?: React.ReactNode
  isOpen?: boolean
  progress: number
}

const Accordion = ({ title, children, isOpen, progress }: ContentToggleProps): JSX.Element => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isShowContent, setIsShowContent] = useState<boolean>(false)
  const [contentHeight, setContentHeight] = useState<number>(0)
  const [isAnimate, setIsAnimate] = useState<boolean>(false)

  const onToggleShowContent = (): void => {
    setIsAnimate(true)
    setIsShowContent(!isShowContent)
  }

  useEffect(() => {
    const handleResize = (): void => {
      setContentHeight((contentRef as any).current.offsetHeight)
    }

    window.addEventListener('resize', handleResize)
    return (): void => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setContentHeight((contentRef as any).current?.offsetHeight)
  }, [children])

  useEffect(() => {
    setIsShowContent(!!isOpen)
  }, [isOpen])

  return (
    <>
      <button onClick={onToggleShowContent} className={accordionStyles.button}>
        <div className={accordionStyles.progressWrapper}>
          <CircularProgress variant="determinate" value={100} size={16} style={{ color: '#474647' }} />
          <CircularProgress variant="determinate" value={progress} size={16} style={{ position: 'absolute', left: 0, color: '#18AAA2' }} />
        </div>
        <label className={accordionStyles.title}>{title}</label>
        <Image src={ArrowIcon} height={10} width={10} alt="arrow icon" className={`${accordionStyles.arrow} ${isShowContent ? accordionStyles.arrowDown : ''}`} />
      </button>
      <div
        className={`${accordionStyles.contentWrapper} ${isAnimate ? accordionStyles.contentWrapperAnimate : ''}`}
        style={{ height: isShowContent ? `${contentHeight}px` : 0}}
      >
        <div ref={contentRef} className={accordionStyles.content}>{children}</div>
      </div>
    </>
  )
}

export { Accordion }

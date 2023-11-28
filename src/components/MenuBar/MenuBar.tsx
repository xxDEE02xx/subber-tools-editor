'use client'
import { FC } from 'react'
import Image from 'next/image'

import VikiLogo from "../../../public/icons/logo.svg"
import ProfileUser1 from "../../../public/icons/profile.svg"
import ExpandIcon from "../../../public/icons/expand.svg"
import EmailIcon from "../../../public/icons/email.svg"

import menubarStyles from './menubar.module.css'

const MenuBar: FC = () => {
  return (
    <div className={menubarStyles.wrapper}>
      <div className={menubarStyles.leftContent}>
        <Image
          src={VikiLogo}
          height={24}
          width={181}
          alt="Viki Community Logo"
        />
      </div>
      <div className={menubarStyles.centerContent}>EN Editing</div>
      <div className={menubarStyles.rightContent}>
        <Image src={EmailIcon} height={24} width={24} alt="email icon" />
        <span className={menubarStyles.count}>5</span>
        <Image src={ProfileUser1} height={36} width={36} alt="User 1 Profile" style={{ marginLeft: '16px' }} />
        <Image src={ExpandIcon} height={16} width={16} alt="expand icon" style={{ marginLeft: '4px' }} />
      </div>
    </div>
  )
}

export { MenuBar }
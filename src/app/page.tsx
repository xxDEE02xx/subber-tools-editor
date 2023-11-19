'use client'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import styles from '@/styles/page.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <div>
        <Typography variant="h4">Welcome to Viki Subber Tools for Editor</Typography>
      </div>
      <Button variant="contained">Button</Button>
    </div>
  )
}

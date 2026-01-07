import React from 'react'
import styles from './Header.module.scss'
import Image from 'next/image'
import { Button, Container } from '@mui/material'

const Header = () => {
  return (
    <>
      <div className={styles.header}>
        <Container>
            <div className='d-flex align-items-center justify-content-center'>
                <Image
                src="/logo.png"
                width={80}
                height={80}
                alt="Picture of the author"
                />
                <div className={`flex-grow-1 text-center ${styles.heading}`}>
                    <h3><strong>Cricket ScoreBook</strong></h3>
                </div>
                <Button variant="outlined" color="error">
                  Clear Tournament
                </Button>
            </div>
        </Container>
      </div>
    </>
  )
}

export default Header

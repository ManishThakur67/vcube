'use client'

import React from 'react'
import styles from './Header.module.scss'
import Image from 'next/image'
import { Button, Container } from '@mui/material'
import { clearDatabase } from '@/lib/indexedDB';
import { useRouter } from 'next/navigation'

const Header = () => {
  const router = useRouter()
  const clearDb = async () => {
    await deleteIndexedDB();    
    router.push('/')
  }
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
                <Button variant="outlined" color="error" onClick={clearDb}>
                  Clear Tournament
                </Button>
            </div>
        </Container>
      </div>
    </>
  )
}

export default Header

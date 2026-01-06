import React from 'react'
import styles from './Footer.module.scss'
import { Container } from '@mui/material'

const Footer = () => {
  return (
    <>
      <div className={styles.footer}>
        <Container>
            <p className='mb-0'>Copyright 2026 Manish Thakur</p>
        </Container>
      </div>
    </>
  )
}

export default Footer

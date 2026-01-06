import React from 'react'
import styles from './Main.module.scss'
import { Container, Paper, Box } from '@mui/material'

const Main = () => {
  return (
    <>
      <div className={styles.mainContainer}>
        <Container>
            <Box
            sx={{
                width: '100%',
                height: '78vh',
                display: 'flex',
                marginTop: '1em',
            }}
            >
            <Paper
                sx={{
                width: '100%',
                height: '100%',
                }}
                elevation={6}
            />
            </Box>
        </Container>
      </div>
    </>
  )
}

export default Main

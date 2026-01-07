import React from 'react'
import styles from './Main.module.scss'
import { Container, Paper, Box } from '@mui/material'
import BreadNavigation from '../breadnavigation/breadnavigation'

const Main = ({children}) => {
  return (
    <>
      <div className={styles.mainContainer}>
        <Container>
            <Box
            sx={{
                width: '100%',
                minHeight: '78vh',
                display: 'flex',
                marginTop: '1em',
            }}
            >
            <Paper
                sx={{
                width: '100%',
                height: '100%',
                padding: '1em 2em',
                }}
                elevation={6}
                className='d-flex flex-column align-items-stretch justify-content-center'
            >
                <div className='mt-3 mb-2'>
                  <BreadNavigation/>
                  <hr />
                </div>
                <div className="w-100 flex-grow-1">
                  {children}
                </div>
            </Paper>
            </Box>
        </Container>
      </div>
    </>
  )
}

export default Main

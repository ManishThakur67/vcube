import React from 'react'
import styles from './matchContainer.module.scss'
import { Button } from '@mui/material'

const MatchContainer = () => {
  return (
    <>
      <div className={styles.matchContainer}>
        <div className='d-flex'>
            <div className={`flex-grow-1 text-center ${styles.name}`}>Team 1</div>
            <div className='align-self-center'>VS</div>
            <div className={`flex-grow-1 text-center ${styles.name}`}>Team 2</div>
        </div>
        <div className='d-flex justify-content-center mt-4'>
             <Button variant="outlined">Start</Button>
        </div>
        
      </div>
    </>
  )
}

export default MatchContainer

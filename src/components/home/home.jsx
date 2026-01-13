import { Button } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import styles from './home.module.scss'

const HomeComp = () => {
  return (
    <>
      <div className={`d-flex flex-column justify-content-center align-items-center`}>
        <h2 className={`mb-4 ${styles.tournamentHeading} text-center`}>Play Cricket</h2>
        <div className='d-flex'>
          <Link href="/scorebook/createtournament">
            <Button variant="outlined" className='me-3' color="primary">
                Play Tournament                
            </Button>
          </Link>
          <Link href="/scorebook/addteam">
            <Button variant="outlined" className='me-3' color="primary">
                Play Single Match
            </Button>          
          </Link>
          <Button variant="outlined" className='me-3' color="primary">
              Play Series
          </Button>
        </div>
      </div>
    </>
  )
}

export default HomeComp

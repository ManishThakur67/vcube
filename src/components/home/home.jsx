import { Button } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import styles from './home.module.scss'

const HomeComp = () => {
  return (
    <>
      <div className={`d-flex flex-column justify-content-center align-items-center`}>
        <h2 className={`mb-4 ${styles.tournamentHeading} text-center`}>Create Your Own Tournament</h2>
        <Link href="/scorebook/createtournament">
          <Button variant="outlined" color="primary">
              Create Tournament                
          </Button>
        </Link>
      </div>
    </>
  )
}

export default HomeComp

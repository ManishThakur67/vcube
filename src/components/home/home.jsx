import { Button } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import styles from './home.module.scss'

const HomeComp = () => {
  return (
    <>
        <h2 className={`mb-4 ${styles.tournamentHeading}`}>Create Your Own Tournament</h2>
        <Button variant="outlined" color="primary">
            <Link href="/scorebook/createtournament">
            Create Tournament                
            </Link>
        </Button>
    </>
  )
}

export default HomeComp

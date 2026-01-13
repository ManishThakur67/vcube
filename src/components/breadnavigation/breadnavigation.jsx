'use client'

import { Breadcrumbs, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';
import { usePathname } from 'next/navigation'
import styles from './breadnavigation.module.scss'

const BreadNavigation = () => {
  const pathname = usePathname()
  return (
    <>
        {
            pathname !== '/' &&
            <>
                <Breadcrumbs aria-label="breadcrumb">
                    <div className={pathname === '/scorebook/createtournament' ? styles.highlight : ''}>
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Create Tournament
                    </div>
                    <div className={pathname === '/scorebook/addteam' ? styles.highlight : ''}>
                        <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Add Team Name                
                    </div>
                    <div>
                        <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Add Player Details
                    </div>
                </Breadcrumbs>
                <hr />
            </>
        }
    </>
  )
}

export default BreadNavigation

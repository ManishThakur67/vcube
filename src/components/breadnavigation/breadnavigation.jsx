import { Breadcrumbs, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import GrainIcon from '@mui/icons-material/Grain';

const BreadNavigation = ({value}) => {
  return (
    <>
        <Breadcrumbs aria-label="breadcrumb">
            <div>
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Create Tournament
            </div>
            <div>
                <WhatshotIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Add Team Name                
            </div>
            <div>
                <GrainIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Add Player Details
            </div>
        </Breadcrumbs>
    </>
  )
}

export default BreadNavigation

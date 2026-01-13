'use client'
import React, {useState, useEffect} from 'react'
import ScoreContainer from '../scoreContainer/scoreContainer'
import { getTeamsByTournament } from '@/lib/indexedDB'
import styles from './scoreScreen.module.scss'
import { Button, Divider } from '@mui/material'
import LiveStats from '../liveStats/liveStats'

const ScoreScreen = () => {
  const [teams, setTeams] = useState([])
  useEffect(() => {
    getTeamDetails()
  },[])

  const getTeamDetails = async () => {
    const teamData = await getTeamsByTournament()
    setTeams(teamData)
  }
  return (
    <>
      <div className='d-flex'>
        <div className='flex-grow-1 text-left'>
          <Button variant="outlined" color="primary">1st Inning</Button>
        </div>
        <div className='flex-grow-1 text-right'>
          <Button variant="outlined" color="primary">2nd Inning</Button>
        </div>
      </div>
      {
        teams.length ? 
        <div className='d-flex align-items-center justify-content-center'>
          <div className='me-2'>
            <p className={styles.name}>{teams[0]?.teamKey}</p>
          </div>
          <div>
            <strong><p>VS</p></strong>
          </div>
          <div className='ms-2'>
            <p className={styles.name}>{teams[1]?.teamKey}</p>
          </div>
        </div>
        : null
      }
      <ScoreContainer />
      <div className='mt-3 mb-3'>
        <Divider sx={{ borderBottomWidth: 3 }}/>
      </div>
      <LiveStats />
    </>
  )
}

export default ScoreScreen

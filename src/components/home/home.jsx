'use client'
import { Button } from '@mui/material'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styles from './home.module.scss'
import { getMatchTypes } from '@/lib/indexedDB';

const HomeComp = () => {
  const [matchData, setMatchData] = useState(null)
  useEffect(() => {
    loadMatchData();
  },[])

  const loadMatchData = async () => {
    const matchTypes = await getMatchTypes();
    setMatchData(matchTypes)
  }

  return (
    <>
      <div className={`d-flex flex-column justify-content-center align-items-center`}>
        <h2 className={`mb-4 ${styles.tournamentHeading} text-center`}>Play Cricket</h2>
        <div className='d-flex'>
          {
            matchData ?
            matchData.map(item => {
              if(item.flag){
                return(
                  <Link key={item.id} href={{pathname: item.url, query:{matchType: item.id}}}>
                    <Button variant="outlined" className='me-3' color="primary">
                        {item.value}                
                    </Button>
                  </Link>
                )
              }
            }) : null
          }                
        </div>
      </div>
    </>
  )
}

export default HomeComp

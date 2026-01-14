'use client'

import { getAllTournaments } from '@/lib/indexedDB'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';

const ScheduleComp = () => {
  const router = useRouter();
  useEffect(() => {
    getTournament()
  },[])

  const getTournament = async () => {
    const tournament = await getAllTournaments()
    if(tournament && tournament[0]?.name === 'Single Match'){
        router.push('/scorebook/matches')
    }
  }

  return (
    <>
      <p>ScheduleComp</p>
    </>
  )
}

export default ScheduleComp

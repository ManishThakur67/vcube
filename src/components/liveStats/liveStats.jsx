import { Grid } from '@mui/material'
import React from 'react'
import styles from './liveStats.module.scss'

const LiveStats = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs:6, sm: 6, md: 3 }}>
            <strong><p className='text-center m-0'>Batting</p></strong>
            <p className={`text-center ${styles.textStyle}`}>Rohit - 24(10)</p>
        </Grid>
        <Grid size={{ xs:6, sm: 6, md: 3 }}>
            <strong><p className='text-center m-0'>Batting</p></strong>
            <p className={`text-center ${styles.textStyle}`}>Rohit - 01(09)</p>
        </Grid>
        <Grid size={{ xs:12, sm: 12, md: 3 }}>
            <strong><p className='text-center m-0'>Bowling</p></strong>
            <p className={`text-center ${styles.textStyle}`}>Dhiraj - 02/10 (6:04)</p>
        </Grid>
        <Grid size={{ xs:12, sm: 12, md: 3 }}>
            <strong><p className='text-center m-0'>Extra's</p></strong>
            <p className={`text-center ${styles.textStyle}`}>W-2, N-2, LB/B-3</p>
        </Grid>
      </Grid>
    </>
  )
}

export default LiveStats

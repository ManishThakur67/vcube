import { Grid } from '@mui/material'
import React from 'react'
import MatchContainer from '../matchContainer/matchContainer'

const MatchList = () => {
  return (
    <>
      <Grid container spacing={2} >
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <MatchContainer />
        </Grid>
      </Grid>
    </>
  )
}

export default MatchList

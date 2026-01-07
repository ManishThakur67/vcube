import { Grid, TextField } from '@mui/material'
import React from 'react'

const TournamentForm = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Tournament Name</label></strong>
            <TextField id="outlined-basic" sx={{width:'100%'}} label="Tournament Name" variant="outlined" />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Tournament Logo</label></strong>
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Runs Point</label></strong>
            <TextField id="outlined-basic" sx={{width:'100%'}} label="Each Match Runs Point" variant="outlined" />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Wicket Point</label></strong>
            <TextField id="outlined-basic" sx={{width:'100%'}} label="Each Match Wicket Point" variant="outlined" />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Runout Point</label></strong>
            <TextField id="outlined-basic" sx={{width:'100%'}} label="Each Match Runout Point" variant="outlined" />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Stumping Point</label></strong>
            <TextField id="outlined-basic" sx={{width:'100%'}} label="Each Match Stumping Point" variant="outlined" />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Catch Point</label></strong>
            <TextField id="outlined-basic" sx={{width:'100%'}} label="Each Match Catch Point" variant="outlined" />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Max Over For Tournament</label></strong>
            <TextField id="outlined-basic" sx={{width:'100%'}} label="Max Over For Tournament" variant="outlined" />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Min Over For Tournament</label></strong>
            <TextField id="outlined-basic" sx={{width:'100%'}} label="Min Over For Tournament" variant="outlined" />
        </Grid>        
      </Grid>
    </>
  )
}

export default TournamentForm

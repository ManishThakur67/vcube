'use client'

import React, { useEffect, useState } from 'react'
import { Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styles from './tournamentForm.module.scss'
import { addTournament, getAllTournaments } from '@/lib/indexedDB';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const initialTournamentData = {
  name: '',
  tieBreak: '',
  logo: null,
  runPoint: '',
  wicketPoint: '',
  catchPoint: '',
  runOutPoint: '',
  stumpingPoint: '',
};


const TournamentForm = () => {
    const [tournamentData, setTournamentData] = useState(initialTournamentData)   

    useEffect(() => {
        setDataInDb()
    },[])
    
    const setDataInDb = async () => {
        const tournaments = await getAllTournaments();
        setTournamentData(tournaments[0])
    }

    const handleOnChange = (e) => {        
        const { name, value, files, type } = e.target;        
        setTournamentData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value,
        }));
    }

    const pushTournamentData = async () => {
        await addTournament(tournamentData);               
    }

  return (
    <>
      <div className='d-flex mb-4 '>
        <h4 className='flex-grow-1'>Tournament Details</h4>
        <Button variant="outlined" onClick={pushTournamentData}>Save & Next</Button>
      </div>
      <Grid container spacing={2}>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Tournament Name <span className={styles.astrick}>*</span></label></strong>
            <TextField id="outlined-basic" name="name" onChange={handleOnChange} value={tournamentData?.name} sx={{width:'100%'}} label="Tournament Name" variant="outlined" />
        </Grid>        
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Match Tie Breaker <span className={styles.astrick}>*</span></label></strong>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Tie Breaker</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={tournamentData?.tieBreak}
                label="Tie Breaker"
                name="tieBreak"
                onChange={handleOnChange}
                >
                <MenuItem value={1}>Compulsary Chase</MenuItem>
                <MenuItem value={2}>Less Wicket</MenuItem>
                <MenuItem value={3}>Toss Win</MenuItem>
                </Select>
            </FormControl>
        </Grid> 

        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Tournament Logo</label></strong>
            <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            >
            Upload files
            <VisuallyHiddenInput
                type="file"
                name="logo"
                onChange={handleOnChange}
            />
            </Button>
        </Grid>
        </Grid>
        <hr />
        <h4 className='mt-5 mb-4'>Tournament's Data for Man Of The Match and Man Of the Series</h4>
        <Grid container spacing={2}>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Runs Point</label></strong>
            <TextField id="outlined-basic" name="runPoint" onChange={handleOnChange} value={tournamentData?.runPoint} sx={{width:'100%'}} label="Each Match Runs Point" variant="outlined" />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Wicket Point</label></strong>
            <TextField id="outlined-basic" name="wicketPoint" onChange={handleOnChange} value={tournamentData?.wicketPoint} sx={{width:'100%'}} label="Each Match Wicket Point" variant="outlined" />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Catch Point</label></strong>
            <TextField id="outlined-basic" name="catchPoint" onChange={handleOnChange} value={tournamentData?.catchPoint} sx={{width:'100%'}} label="Each Match Catch Point" variant="outlined" />
        </Grid>               
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Runout Point</label></strong>
            <TextField id="outlined-basic" name="stumpingPoint" onChange={handleOnChange} value={tournamentData?.stumpingPoint} sx={{width:'100%'}} label="Each Match Runout Point" variant="outlined" />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Stumping Point</label></strong>
            <TextField id="outlined-basic" name="runOutPoint" onChange={handleOnChange} value={tournamentData?.runOutPoint} sx={{width:'100%'}} label="Each Match Stumping Point" variant="outlined" />
        </Grid>
      </Grid>
      <hr />      
    </>
  )
}

export default TournamentForm

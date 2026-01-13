'use client'

import React, {useEffect, useMemo, useState} from 'react'
import styles from './addTeam.module.scss'
import { Button, Divider, FormControl, Grid, Snackbar, TextField } from '@mui/material'
import NumberField from '../numberInput/numberInput'
import { addTeams, getTeamsByTournament } from '@/lib/indexedDB'
import { useRouter } from 'next/navigation';

const AddTeamComp = () => {
  const router = useRouter()
  const [teamSelected, setTeamSelected] = useState(2);
  const [teamData, setTeamData] = useState([])
  const [alertMessage, setAlertMessage] = useState("")  
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    getTeamData()
  },[])

  const getTeamData = async () => {
    const data = await getTeamsByTournament()
    if(data || data?.length){
      router.push('/scorebook/singlematch')
    }
  }

  const handleOnChange = (e) => {
    const {name, value} = e.target
    setTeamData(prev => ({
      ...prev, [name]: value
    }))
  }

  const handleOnclick = async () => {
    await addTeams(teamData)
    setAlertMessage('Team Added Successfully')
    setShowAlert(true)
  }

  const teamList = useMemo(() => {
    return Array.from({ length: teamSelected }, (_, index) => (
      <Grid size={{ sm: 12, md: 3 }} key={index}>
        <strong><label className='mb-3'>Team Name {index+1}</label></strong>
        <TextField name={`team${index+1}`} onChange={handleOnChange} sx={{width:'100%'}} variant="outlined" />
      </Grid>
    ))
  },[teamSelected])

  const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
      return;
      }

      setShowAlert(false);
  };


  return (
    <>
        <div className='d-flex flex-column justify-content-center align-items-center mb-3'>
            <strong><label className='mb-3'>Select Number of Teams</label></strong>
            <FormControl>
                <NumberField name="team"
                onValueChange={(value) => setTeamSelected(value)}
                value={teamSelected}
                min={2}
                max={100} />
            </FormControl>
        </div>
        <Divider sx={{ borderBottomWidth: 3 }}/>
        <Grid container spacing={2} className="mt-3 mb-3">
          {teamList}
        </Grid>
        <Divider sx={{ borderBottomWidth: 3 }}/>
        <div className='mt-3 d-flex justify-content-end'>
          <Button variant="outlined" onClick={handleOnclick}>Save and Next</Button>
        </div>

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={showAlert}
          onClose={handleClose}
          autoHideDuration={1000}
          message={alertMessage}
        />
    </>
  )
}

export default AddTeamComp

'use client'

import React, {useEffect, useMemo, useState} from 'react'
import styles from './addTeam.module.scss'
import { Button, Divider, FormControl, Grid, Snackbar, TextField } from '@mui/material'
import NumberField from '../numberInput/numberInput'
import { addTeams, getTeamsByTournament, getMatchTypes, getAllTournaments, addTournament } from '@/lib/indexedDB'
import { useRouter, useSearchParams } from 'next/navigation';

const defaultTournament = {
      tieBreak: 1,
      logo: '',
      runPoint: 0,
      wicketPoint: 0,
      catchPoint: 0,
      stumpingPoint: 0,
      runOutPoint: 0,
    }

const AddTeamComp = () => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const matchTypeIs = searchParams.get('matchType');
  const [teamSelected, setTeamSelected] = useState(2);
  const [teamData, setTeamData] = useState([])
  const [alertMessage, setAlertMessage] = useState("")  
  const [showAlert, setShowAlert] = useState(false)
  const [matchData, setMatchData] = useState(null)
  const [tournamentDataIs, setTournamentDataTo] = useState(null)

  useEffect(() => {
    getTeamData()
  },[])

  useEffect(() => {
    if(matchData){
      checkTournament()
    }
  },[matchData])

  const checkTournament = async () => {
    const tournamentData = await getAllTournaments()
    const matchdata = matchData.find(item => matchTypeIs == item.id)
    if(!tournamentData.length){
      const setTournamentData = {...defaultTournament, name: matchdata.value, matchTypeId: matchdata.id}
      await addTournament(setTournamentData);
      checkTournament()
    }else{
      setTournamentDataTo(tournamentData)
    }
  }
  
  const getTeamData = async () => {
    const data = await getTeamsByTournament()
    const matchDataIs = await getMatchTypes()
    setMatchData(matchDataIs)
    if(data?.length){
      router.push('/scorebook/schedule')
    }
  }

  const handleOnChange = (e) => {
    const {name, value} = e.target
    setTeamData(prev => ({
      ...prev, [name]: value
    }))
  }

  const handleOnclick = async () => {
    const obj = Object.keys(teamData)
    if(teamSelected === obj?.length){
      await addTeams(teamData, tournamentDataIs[0]?.id)
      setAlertMessage('Team Added Successfully')
      setShowAlert(true)
      router.push('/scorebook/schedule')
    }else{
      setAlertMessage(`Add ${teamSelected} Team Name`)
      setShowAlert(true)
    }
  }

  const teamList = useMemo(() => {
    return Array.from({ length: teamSelected }, (_, index) => (
      <Grid size={{ sm: 12, md: 3 }} key={crypto.randomUUID()}>
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
            <strong><label className='mb-3'>Add Number of Teams</label></strong>
            <FormControl>
                <NumberField name="team"
                onValueChange={(value) => {setTeamSelected(value); setTeamData([])}}
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

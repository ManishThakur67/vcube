'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Snackbar } from '@mui/material'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styles from './tournamentForm.module.scss'
import { addTournament, getAllTournaments, updateTournament } from '@/lib/indexedDB';
import { toBase64 } from '@/lib/utility';
import Image from 'next/image';
import NumberField from '../numberInput/numberInput';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


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
  runPoint: 1,
  wicketPoint: 1,
  catchPoint: 1,
  runOutPoint: 1,
  stumpingPoint: 1,
};


const TournamentForm = () => {
    const router = useRouter()
    const [tournamentData, setTournamentData] = useState(initialTournamentData) 
    const [alertMessage, setAlertMessage] = useState("")  
    const [showAlert, setShowAlert] = useState(false)
    const [dbData, setDBData] = useState(null)

    useEffect(() => {
        setDataInDb();
        // addTournament(tournamentData);
    },[])
    
    const setDataInDb = async () => {
        const tournaments = await getAllTournaments();
        if(tournaments && tournaments[0]?.id){
            setTournamentData(tournaments[0])
            setDBData(tournaments[0])
        } 
    }

    const handleOnChange = async (e) => {               
        const { name, value, files, type } = e.target;  
        const base64Image = type === 'file' && await toBase64(files?.[0])     
        setTournamentData(prev => ({
            ...prev,
            [name]: type === 'file' ? base64Image : value,
        }));
        // if (name === 'logo' && files?.[0]) {
        //     showImage(files[0]);
        // }
    }

    // const showImage = async (file) => {
    //     const base64File = await toBase64(file)
    //     setLogoImage(base64File)
    // }

    const checkParameter = async (data) => {
        const {name, tieBreak} = data
        if(!name){
            setAlertMessage('Tournament Name is Mandatory')
            setShowAlert(true)
            return false
            
        }
        if(!tieBreak){
            setAlertMessage('Tie Breaker is Mandatory')
            setShowAlert(true)
            return false
        }
        return true;
    }

    const pushTournamentData = async () => {
        const mandatoryCheck = await checkParameter(tournamentData)
        if(mandatoryCheck){
            if(!tournamentData?.id){
                await addTournament(tournamentData);
                setAlertMessage('Tournament Created Successfully')
            }else{
                await updateTournament(tournamentData);
                setAlertMessage('Tournament Updated Successfully')
            }
            setShowAlert(true)
            router.push('/scorebook/addteam')
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setShowAlert(false);
    };

    const deepEqual = (a, b) => {
        if (a === b) return true

        // handle null / undefined
        if (a == null || b == null) return a === b

        // handle different types
        if (typeof a !== typeof b) return false

        // handle arrays
        if (Array.isArray(a)) {
            if (!Array.isArray(b) || a.length !== b.length) return false
            return a.every((item, index) => deepEqual(item, b[index]))
        }

        // handle objects
        if (typeof a === 'object') {
            const keysA = Object.keys(a)
            const keysB = Object.keys(b)

            if (keysA.length !== keysB.length) return false

            return keysA.every(key => deepEqual(a[key], b[key]))
        }

        // handle primitives
        return a === b
    }


    const comparedData = useMemo(() => {
        if (!tournamentData || !dbData) return false

        return deepEqual(tournamentData, dbData)
    }, [tournamentData, dbData])

  return (
    <>
      <div className='d-flex mb-4 '>
        <h4 className='flex-grow-1'>Tournament Details</h4>
        {
            (!tournamentData?.id || !comparedData) ? 
            <Button variant="outlined" onClick={pushTournamentData}>Save & Next</Button>
            :
            <Link href="/scorebook/addteam">
                <Button variant="outlined">Next</Button>
            </Link>
        }
      </div>
      <Grid container spacing={2}>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Tournament Name <span className={styles.astrick}>*</span></label></strong>
            <TextField id="outlined-basic" name="name" onChange={handleOnChange} value={tournamentData?.name} sx={{width:'100%'}} variant="outlined" />
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
        <Grid size={{ sm: 12, md: 3 }}>
            {
                tournamentData?.logo ? 
                <Image
                    src={tournamentData?.logo}
                    width={500}          // intrinsic width
                    height={200}         // intrinsic height (keep ratio)
                    style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    }}
                    alt="logo"
                /> : null
            }
        </Grid>
        </Grid>
        <hr />
        <h4 className='mt-5 mb-4'>Tournament's Data for Man Of The Match and Man Of the Series</h4>
        <Grid container spacing={2}>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Runs Point</label></strong>
            <NumberField label="Run Point" name="runPoint"
            onValueChange={(value) =>
            setTournamentData(prev => ({
                ...prev,
                runPoint: value,
            }))
            }
            value={tournamentData?.runPoint}
            min={1}
            max={100} />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Wicket Point</label></strong>
            <NumberField label="Wicket Point" name="wicketPoint" 
            onValueChange={(value) =>
            setTournamentData(prev => ({
                ...prev,
                wicketPoint: value,
            }))
            }
            value={tournamentData?.wicketPoint} min={1} max={100} />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Catch Point</label></strong>
            <NumberField label="Catch Point" name="catchPoint" 
            onValueChange={(value) =>
            setTournamentData(prev => ({
                ...prev,
                catchPoint: value,
            }))
            } 
            value={tournamentData?.catchPoint} min={1} max={100} />
        </Grid>               
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Runout Point</label></strong>
            <NumberField label="Stumping Point" name="stumpingPoint" 
            onValueChange={(value) =>
            setTournamentData(prev => ({
                ...prev,
                stumpingPoint: value,
            }))
            } 
            value={tournamentData?.stumpingPoint} min={1} max={100} />
        </Grid>
        <Grid size={{ sm: 12, md: 3 }}>
            <strong><label className='mb-3'>Each Match Stumping Point</label></strong>
            <NumberField label="Run Out Point" name="runOutPoint" 
            onValueChange={(value) =>
            setTournamentData(prev => ({
                ...prev,
                runOutPoint: value,
            }))
            } 
            value={tournamentData?.runOutPoint} min={1} max={100} />
        </Grid>
      </Grid>
      <hr />  
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

export default TournamentForm

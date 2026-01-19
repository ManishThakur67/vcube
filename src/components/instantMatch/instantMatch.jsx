import { Button, Dialog, DialogContent, Divider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NumberField from '../numberInput/numberInput'
import styles from './instantMatch.module.scss'
import OverCalculator from '../overCalculator/overCalculator'

const InstantMatch = ({show, closeModal}) => {
    const [open, setOpen] = useState(false)
    const [over, setOver] = useState('')
    const [overObject, setOverObj] = useState(null)    
    useEffect(() => {
        setOpen(show)
    },[show])

    useEffect(() => {
        const localOverData = localStorage.getItem('matchData')
        if(localOverData) setOverObj(localOverData)
    },[])

    const handleClose = () => {
        setOpen(false)
        closeModal()
    }

    const handleOverClick = () => {
    const createOvers = () => {
        const arr = [];
        for (let i = 0; i < over; i++) {
        arr.push({
            [`over ${i + 1}`]: [],
            isCompleted: i === 0 ? "Start" : "Pending",
        });
        }
        return arr;
    };

    const matchData = {
        currentInning: 1,
        firstInning: createOvers(),
        secondInning: []
    };

    setOverObj(matchData);
    localStorage.setItem("matchData", JSON.stringify(matchData));
    setOver('')
    };

    const startNew = () => {
        setOverObj(null)
        setOver('')
    }


  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={open}        
        onClose={handleClose}
      >
        <DialogContent sx={{ padding: '32px' }}>
            <div className='d-flex flex-column align-items-center mb-3'>
                <strong><label className='mb-3'>Enter Over For Match</label></strong>
                <NumberField label="Over" name="over"
                onValueChange={(value) =>
                    setOver(value)
                }
                value={over}
                min={1}
                max={100} />
                <Button sx={{marginTop: '15px'}} disabled={overObject && true} onClick={handleOverClick} variant="outlined" color="primary">Add Overs</Button>
            </div>
            <Divider sx={{ borderBottomWidth: 3, marginBottom: '20px' }}/>
            <OverCalculator overData={overObject} reStart={startNew}/>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default InstantMatch

import { Button, Dialog, DialogContent, Divider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NumberField from '../numberInput/numberInput'
import styles from './instantMatch.module.scss'
import OverCalculator from '../overCalculator/overCalculator'

const InstantMatch = ({show, closeModal}) => {
    const [open, setOpen] = useState(false)
    const [over, setOver] = useState(0)
    const [overObject, setOverObj] = useState(null)
    useEffect(() => {
        setOpen(show)
    },[show])

    useEffect(() => {
        const localOverData = localStorage.getItem('overData')
        if(localOverData) setOverObj(localOverData)
    },[])

    const handleClose = () => {
        setOpen(false)
        closeModal()
    }

    const handleOverClick = () => {
        const array = [];

        for (let i = 0; i < over; i++) {
            array.push({
            [`over ${i + 1}`]: [],
            isCompleted: false,
            });
        }

        setOverObj(array);
        localStorage.setItem('overData', JSON.stringify(array));
    };


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
                <Button sx={{marginTop: '15px'}} onClick={handleOverClick} variant="outlined" color="primary">Add Overs</Button>
            </div>
            <Divider sx={{ borderBottomWidth: 3 }}/>
            <OverCalculator overData={overObject}/>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default InstantMatch

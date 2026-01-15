import { getRunTypes } from '@/lib/indexedDB'
import { Button, Divider, Grid } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'

const MAX_RUN = 7; //include 0 as well

const OverCalculator = ({overData}) => { 
    const [runTypeData, setRunTypeData] = useState(null)  
    useEffect(() => {
        getRunType()
    },[])

    const getRunType = async () => {
        const runType = await getRunTypes()
        setRunTypeData(runType)
    }

    const runsUI = useMemo(() => {
        let htmlElement = []
        for (let i = 0; i < MAX_RUN; i++) {            
            let html =  <Grid key={i} size={{ xs:6, sm: 6, md: 'grow' }}>
                        <Button sx={{marginRight: '15px'}} fullWidth key={i} variant="outlined" color="error">
                            {i}
                        </Button>
                    </Grid>
            htmlElement.push(html)             
        }
        return htmlElement;
    },[])

    // const runs = useMemo(() => {
    //     return overData.map(item => {
    //         return(
                
    //         )
    //     })
    // },[overData])

    // console.log(overData)

  return (
    <>

    {
        overData ? 
        <>
            {/* <div>
                {runs}
            </div> */}
            <Divider sx={{ borderBottomWidth: 3, margin: '0px 20px' }}/>     
            <Grid container sx={{marginTop: "30px"}} spacing={2}>        
            {
                runTypeData ?
                runTypeData.map((item, index) => {
                    return(
                        <Grid key={index} size={{ xs:6, sm: 6, md: 'grow' }}>
                            <Button sx={{marginRight: '15px'}} fullWidth key={item.id} variant="outlined" color="warning">
                                {item.value}
                            </Button>
                        </Grid>
                    )
                }) : null
            }
            </Grid>

            <Grid container sx={{marginTop: '30px'}} spacing={2}>
                {runsUI}
            </Grid>
        </>
        : null
    }
      
    </>
  )
}

export default OverCalculator

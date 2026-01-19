import React from 'react'
import styles from './addTeam.module.scss'
import AddTeamComp from '@/components/addTeam/addTeam'
import { Suspense } from "react";

const AddTeam = () => {
  
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <AddTeamComp />        
      </Suspense>
    </>
  )
}

export default AddTeam

import React, { useEffect, useState } from 'react'
import styles from './scoreContainer.module.scss'

const ScoreContainer = () => {
  return (
    <>
      <div className={styles.scoreParent}>
        <div className='d-flex'>
            <p className={`flex-grow-1 ${styles.scoreValue} text-right pe-2`}>20</p>
            <p className={`flex-grow-1 ${styles.scoreValue} ps-2`}>03</p>
        </div>
        <div className='text-center'>
          <p>1.3 Over</p>
        </div>
        <div className={`d-flex align-items-center justify-content-center ${styles.netRun}`}>
            <p className={`m-0 ${styles.netRunitem}`}>CRR : 07.98</p>
            <p className={`m-0 ${styles.netRunitem}`}>RRR : 08.97</p>
            <p className={`m-0 ${styles.netRunitem}`}>EXTRA : 16</p>
        </div>
      </div>
    </>
  )
}

export default ScoreContainer

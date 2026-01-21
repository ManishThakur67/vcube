import { getRunTypes } from "@/lib/indexedDB";
import {
  Button,
  Divider,
  Grid,
  Dialog,
  DialogContent,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import OverComponent from "../overComponent/overComponent";
import styles from './overCalculator.module.scss'

const MAX_RUN = 7;
const EXTRA = {
  Byes: "b",
  Declare: "d",
  "Leg Byes": "lb",
  "No Ball": "n",
  Wide: "wd",
};

/* ------------------ helpers ------------------ */

const createOvers = (count) =>
  Array.from({ length: count }, (_, i) => ({
    [`over ${i + 1}`]: [],
    isCompleted: i === 0 ? "Start" : "Pending",
  }));

const isLegalBall = (ball) => {
  if (!("run" in ball)) return false;

  // only Wide & No Ball are illegal deliveries
  return ball.extra !== "Wide" && ball.extra !== "No Ball";
};


const isOverCompleted = (overObj) => {
  if (!overObj) return false;

  const key = Object.keys(overObj).find((k) => k.startsWith("over "));
  if (!key) return false;

  const legalBalls = overObj[key].filter(isLegalBall);
  return legalBalls.length >= 6;
};

const calculateTotalScore = (overs = []) =>
  overs.reduce((total, over) => {
    const key = Object.keys(over).find(k => k.startsWith("over "));
    return (
      total +
      over[key].reduce(
        (sum, ball) =>
          sum + (ball.run || 0) + (ball.extraRun || 0),
        0
      )
    );
  }, 0);

/* ------------------ component ------------------ */

const OverCalculator = ({ overData, reStart }) => {
  const [runTypes, setRunTypes] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [ongoingOver, setOngoingOver] = useState(null);

  const [extra, setExtra] = useState(null);
  const [extraDialog, setExtraDialog] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
//   const [isReset, setIsReset] = useState(false);

  const resetMatch = () => {
  setMatchData(null);
  setOngoingOver(null);
  setExtra(null);
  setExtraDialog(false);
  setConfirmReset(false);
  reStart()
//   setIsReset(true);

  // clear storage
  localStorage.removeItem("matchData");
  localStorage.removeItem("overData");
  localStorage.removeItem("first_inning_score");
};

useEffect(() => {
  if (matchData) {
    localStorage.setItem("matchData", JSON.stringify(matchData));
  }
}, [matchData]);

// useEffect(() => {
//   const storedMatch = localStorage.getItem("matchData");

//   if (storedMatch && !isReset) {
//     setMatchData(JSON.parse(storedMatch));
//     return;
//   }

//   if (overData) {
//     setMatchData(overData);
//     setIsReset(false);
//   }
// }, []); // still run once

useEffect(() => {
  const stored = localStorage.getItem("matchData");
console.log(stored, '--------', overData)
  if (stored) {
    setMatchData(JSON.parse(stored));
  } else if (overData) {
    setMatchData(overData);
  }
}, [overData]); // ✅ run ONCE


  /* ---------- load run types ---------- */
  useEffect(() => {
    getRunTypes().then(setRunTypes);
  }, []);

  /* ---------- initialize match ---------- */
//   useEffect(() => {
//   const storedMatch = localStorage.getItem("matchData");

//   if (storedMatch) {
//     setMatchData(JSON.parse(storedMatch));
//     return;
//   }

//   if (overData) {
//     setMatchData(overData);
//   }
// }, []); // 👈 EMPTY dependency array



  /* ---------- derived current overs ---------- */
  const currentOvers = useMemo(() => {
    if (!matchData) return [];
    return matchData.currentInning === 1
      ? matchData.firstInning
      : matchData.secondInning;
  }, [matchData]);

  /* ---------- track ongoing over ---------- */
  useEffect(() => {
    const startOver = currentOvers.find(
      (o) => o.isCompleted === "Start"
    );
    setOngoingOver(startOver || null);
  }, [currentOvers]);

  /* ---------- run click ---------- */
  const addRun = (run) => {
    if (!ongoingOver || isOverCompleted(ongoingOver)) return;

    if (
  matchData.currentInning === 2 &&
    calculateTotalScore(currentOvers) >= matchData.target
    ) {
    return; // match finished
  }

    const key = Object.keys(ongoingOver)[0];

    const updatedOver = {
      ...ongoingOver,
      [key]: [...ongoingOver[key], { run }],
    };

    updateMatchOver(updatedOver);
  };

  /* ---------- extra run ---------- */
    const addExtra = (run) => {
        if (!ongoingOver || isOverCompleted(ongoingOver)) return;

        if (
        matchData.currentInning === 2 &&
        calculateTotalScore(currentOvers) >= matchData.target
        ) {
        return; // match finished
        }

        const key = Object.keys(ongoingOver)[0];

        const extraRun =
            extra === "Wide" || extra === "No Ball" ? 1 : 0;

        const updatedOver = {
            ...ongoingOver,
            [key]: [
            ...ongoingOver[key],
            {
                run,
                extra,
                extraRun   // 👈 IMPORTANT
            }
            ]
        };

        setExtra(null);
        setExtraDialog(false);
        updateMatchOver(updatedOver);
    };


  /* ---------- update match state ---------- */
const updateMatchOver = (updatedOver) => {
  const updatedKey = Object.keys(updatedOver).find(k =>
    k.startsWith("over ")
  );

  setMatchData(prev => {
    if (!prev) return prev;

    const inningKey =
      prev.currentInning === 1 ? "firstInning" : "secondInning";

    let overs = prev[inningKey].map(o => {
      if (!o.hasOwnProperty(updatedKey)) return o;

      return {
        ...o,
        [updatedKey]: updatedOver[updatedKey],
        isCompleted: isOverCompleted(updatedOver)
          ? "Completed"
          : "Start",
      };
    });

    /* start next over */
    if (isOverCompleted(updatedOver)) {
      const nextIdx = overs.findIndex(o => o.isCompleted === "Pending");

      if (nextIdx !== -1) {
        overs = overs.map((o, i) =>
          i === nextIdx ? { ...o, isCompleted: "Start" } : o
        );
      } else if (prev.currentInning === 1) {
        const firstInningScore = calculateTotalScore(overs);
        const target = firstInningScore + 1;

        return {
          ...prev,
          currentInning: 2,
          target,
          firstInning: overs,
          secondInning: createOvers(overs.length),
        };
      }
    }

    return {
      ...prev,
      [inningKey]: overs,
    };
  });
};


  const runsRemaining =
  matchData?.currentInning === 2
    ? matchData.target - calculateTotalScore(currentOvers)
    : null;

    const isMatchFinished = useMemo(() => {
    if (!matchData) return false;

    if (matchData.currentInning !== 2) return false;

    const score = calculateTotalScore(currentOvers);

    return (
        score >= matchData.target ||
        !ongoingOver
    );
    }, [matchData, currentOvers, ongoingOver]);

    const countLegalBalls = (overs = []) =>
    overs.reduce((total, over) => {
        const key = Object.keys(over).find(k => k.startsWith("over "));
        const legalBalls = over[key].filter(isLegalBall).length;
        return total + legalBalls;
    }, 0);

    const totalBalls =
    matchData ? matchData.firstInning.length * 6 : 0;

    const ballsRemaining =
    matchData?.currentInning === 2
        ? totalBalls - countLegalBalls(currentOvers)
        : null;

const getMatchResult = (matchData, currentOvers) => {
  if (!matchData || matchData.currentInning !== 2) return null;

  const score = calculateTotalScore(currentOvers);
  const target = matchData.target;

  const totalBalls = matchData.firstInning.length * 6;
  const ballsBowled = countLegalBalls(currentOvers);
  const ballsRemaining = totalBalls - ballsBowled;

  if (score >= target) return "INNING_2_WON";
  if (ballsRemaining === 0 && score < target) return "INNING_1_WON";

  return "ONGOING";
};

const matchResult = useMemo(
  () => getMatchResult(matchData, currentOvers),
  [matchData, currentOvers]
);

const getOversAndBalls = (overs = []) => {
  const legalBalls = countLegalBalls(overs);

  const completedOvers = Math.floor(legalBalls / 6);
  const ballsInCurrentOver = legalBalls % 6;

  return {
    completedOvers,
    ballsInCurrentOver,
    oversFormatted: `${completedOvers}.${ballsInCurrentOver}`,
  };
};




  /* ------------------ UI ------------------ */
  
  const { completedOvers, ballsInCurrentOver, oversFormatted } = getOversAndBalls(currentOvers);
  return (
      <>
      {matchData && (
        <>
        {
            (matchResult !== 'ONGOING' && matchResult) ?
            <div className={`d-flex justify-content-center ${styles.winningContainer}`}>            
                <h5>
                    {matchResult === "INNING_2_WON" && (
                    <>Inning 2 Won 🎉</>
                    )}
                    {matchResult === "INNING_1_WON" && (
                    <>Inning 1 Won 🏆</>
                    )}
                </h5>    
            </div>       
            : null
        }
        <div className="d-flex mb-3">  
            <div className={`${styles.scoreContainer} flex-grow-1`}>
                <div className={styles.scoreIn}>Inning {matchData?.currentInning}</div>
                <div className="d-flex">
                    <div className="flex-fill text-center border-right pt-1">
                      <p className={`${styles.span} mb-0`}>Run</p> 
                      <p className={`mb-0 ${styles.scoreMain}`}>{calculateTotalScore(currentOvers)}</p>
                    </div>
                    <div className="flex-fill text-center pt-1">
                      <p className={`${styles.span} mb-0`}>Over</p> 
                      <p className={`mb-0 ${styles.scoreMain}`}>{oversFormatted}</p>
                    </div>
                </div>
                {matchData.currentInning === 2 && (
                    <div className="border-top">
                      <p className={`mb-0 ${styles.scoreMain} text-center`}>
                        Target({matchData.target})
                      </p>
                    </div>
                )}
            </div>
            {/* <div className="flex-grow-1">
                <p className={styles.scoreBoard}>
                    Inning: {matchData?.currentInning} | 
                    Score: {calculateTotalScore(currentOvers)}

                    {matchData.currentInning === 2 && (
                        <>
                        {" "} | Target: {matchData.target}
                        </>
                    )}
                </p>                
            </div>           */}
            {/* {matchData.currentInning === 2 && (
                <p>
                    {runsRemaining > 0
                    ? `Need ${runsRemaining} runs to win`
                    : "Match Won 🎉"}
                </p>
            )} */}
            {isMatchFinished && (
              <div className="ms-3">
                <Button
                color="success"
                variant="contained"
                onClick={() => setConfirmReset(true)}
                >
                Start New Match
                </Button>
              </div>
            )}
        </div>   
        {matchData.currentInning === 2 && (
            <div className={`${styles.toWin} mb-2`}>
                <p className="m-0">
                    {runsRemaining > 0
                    && `Need ${runsRemaining} runs to win in ${ballsRemaining} balls`}
                </p>
            </div>   
        )}        

          <Divider sx={{ my: 3 }} />
          {/* Run Types */}
          <Grid container spacing={2}>
            {runTypes.map((r) => (
              <Grid key={r.id} size={{ xs: 3, md: "grow" }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  onClick={() => {
                    setExtra(r.value);
                    setExtraDialog(true);
                  }}
                >
                  {EXTRA[r.value]}
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Runs */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {Array.from({ length: MAX_RUN }, (_, i) => (
              <Grid key={i} size={{ xs: 3, md: "grow" }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  disabled={!ongoingOver}
                  onClick={() => addRun(i)}
                >
                  {i}
                </Button>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={2}>
            {currentOvers.map((item) => {
              const key = Object.keys(item).find((k) =>
                k.startsWith("over ")
              );
              return (
                <Grid key={key} size={{ xs: 12, sm: 12, md: 3 }}>
                  <OverComponent
                    data={item}
                    over={Number(key.split(" ")[1])}
                  />
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      {/* Extra Dialog */}
      <Dialog open={extraDialog} onClose={() => setExtraDialog(false)}>
        <DialogContent>
          <Grid container spacing={2}>
            {Array.from({ length: MAX_RUN }, (_, i) => (
              <Grid key={i} size={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => addExtra(i)}
                >
                  {i}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

    <Dialog open={confirmReset} onClose={() => setConfirmReset(false)}>
        <DialogContent>
            <p>Start a new match? This will clear all data.</p>
            <Button onClick={resetMatch} color="error">Yes</Button>
            <Button onClick={() => setConfirmReset(false)}>Cancel</Button>
        </DialogContent>
    </Dialog>
    </>
  );
};

export default OverCalculator;

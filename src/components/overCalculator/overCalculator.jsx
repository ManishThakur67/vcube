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
const MAX_BALLS = 6;
const MAX_WICKETS = 10;
const getInitialMatchData = () => ({
  currentInning: 1,
  firstInning: [],
  secondInning: [],
  target: null,
});
const EXTRA = {
  Byes: "byes",
  Declare: "dec",
  "Leg Byes": "leg byes",
  "No Ball": "nb",
  Wide: "wd",
};

/* ------------------ helpers ------------------ */

const isLegalBall = (ball) =>
  ball.extra !== "Wide" && ball.extra !== "No Ball";

const isOverCompleted = (over) => {
  const key = Object.keys(over).find(k => k.startsWith("over "));
  if (!key) return false;

  const legalBalls = over[key].filter(isLegalBall);
  return legalBalls.length === MAX_BALLS;
};

const isInningsCompleted = (overs) =>
  overs.every(o => o.isCompleted === "Completed");

const calculateTotalScore = (overs = []) =>
  overs.reduce((sum, over) => {
    const key = Object.keys(over).find(k => k.startsWith("over "));
    if (!key) return sum;

    return (
      sum +
      over[key].reduce(
        (s, b) => s + (b.run || 0) + (b.extraRun || 0),
        0
      )
    );
  }, 0);


const calculateTotalWickets = (overs = []) =>
  overs.reduce((sum, over) => {
    const key = Object.keys(over).find(k => k.startsWith("over "));
    if (!key) return sum;
    return sum + over[key].filter(b => b.wicket).length;
  }, 0);

const createOvers = (count) =>
  Array.from({ length: count }).map((_, i) => ({
    [`over ${i + 1}`]: [],
    isCompleted: i === 0 ? "Start" : "Pending",
  }));

const normalizeMatchData = (data) => {
  if (!data) return null;

  // already valid
  if (data.currentInning && data.firstInning) {
    return data;
  }

  // parent passed only overs
  if (Array.isArray(data)) {
    return {
      currentInning: 1,
      firstInning: data,
      secondInning: [],
      target: null,
    };
  }

  return null;  
};

const sortOversDesc = (overs = []) =>
  [...overs].sort((a, b) => {
    const aKey = Object.keys(a).find(k => k.startsWith("over "));
    const bKey = Object.keys(b).find(k => k.startsWith("over "));

    return Number(bKey.split(" ")[1]) - Number(aKey.split(" ")[1]);
  });

const hasAnyBall = (overObj) => {
  const key = Object.keys(overObj).find(k => k.startsWith("over "));
  if (!key) return false;

  const balls = overObj[key] || [];

  // show over only if at least one delivery exists
  return balls.length > 0;
};




/* ------------------ component ------------------ */

const OverCalculator = ({ overData, reStart }) => {
  const [runTypes, setRunTypes] = useState([]);
  const [matchData, setMatchData] = useState(() => {
  const stored = localStorage.getItem("matchData");
  if (stored) return JSON.parse(stored);

  return normalizeMatchData(overData);
});


  const [ongoingOver, setOngoingOver] = useState(null);

  const [extra, setExtra] = useState(null);
  const [isWicket, setIsWicket] = useState(false);
  const [extraDialog, setExtraDialog] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
const [editDialog, setEditDialog] = useState(false);
const [editContext, setEditContext] = useState(null);

  const resetMatch = () => {
  const fresh = normalizeMatchData(overData);

  setMatchData(fresh);
  setOngoingOver(null);
  setExtra(null);
  setIsWicket(false);
  setExtraDialog(false);
  setConfirmReset(false);
  setEditDialog(false);
  setEditContext(null);
  reStart()

  localStorage.removeItem("matchData");
};



useEffect(() => {
  if (matchData) {
    localStorage.setItem("matchData", JSON.stringify(matchData));
  }
}, [matchData]);

  /* ---------- load run types ---------- */
  useEffect(() => {
    getRunTypes().then(setRunTypes);
  }, []);  

const currentOvers =
  matchData?.currentInning === 1
    ? matchData?.firstInning || []
    : matchData?.secondInning || [];

const matchEnded =
  matchData?.currentInning === 2 &&
  isInningsCompleted(matchData.secondInning);

const hasActiveOver = currentOvers.some(o => o.isCompleted === "Start");

const disableRunButtons =
  matchEnded ||
  calculateTotalWickets(currentOvers) >= MAX_WICKETS ||
  !hasActiveOver;

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

  const wickets = calculateTotalWickets(currentOvers);
  if (wickets >= MAX_WICKETS) return;

  if (
    matchData.currentInning === 2 &&
    calculateTotalScore(currentOvers) >= matchData.target
  ) {
    return;
  }

  // ✅ PASS ONLY BALL
  updateMatchOver({ run });
};


  /* ---------- extra run ---------- */
const addExtra = (run) => {
  if (!ongoingOver || isOverCompleted(ongoingOver)) return;

  const wickets = calculateTotalWickets(currentOvers);
  if (wickets >= MAX_WICKETS) return;

  if (
    matchData.currentInning === 2 &&
    calculateTotalScore(currentOvers) >= matchData.target
  ) {
    return;
  }

  if((extra === 'Decalre' || extra === 'Leg Byes' || extra === 'Byes') && !run){
    return
  }

  const extraRun =
    extra === "Wide" || extra === "No Ball" ? 1 : 0;

  const ball = {
    run,
    ...(extra && { extra, extraRun }),
    ...(isWicket && { wicket: true }),
  };

  // ✅ PASS ONLY BALL
  updateMatchOver(ball);

  setExtra(null);
  setIsWicket(false);
  setExtraDialog(false);
};

  /* ---------- update match state ---------- */
const updateMatchOver = (ball) => {
  setMatchData(prev => {
    const inningKey =
      prev.currentInning === 1 ? "firstInning" : "secondInning";

    let overs = structuredClone(prev[inningKey]);

    const overIndex = overs.findIndex(o => o.isCompleted === "Start");
    if (overIndex === -1) return prev;

    const over = overs[overIndex];
    const overKey = Object.keys(over).find(k => k.startsWith("over "));

    // add ball
    over[overKey].push(ball);

    /* ---------------- OVER COMPLETION ---------------- */
    overs = overs.map(o => {
      const key = Object.keys(o).find(k => k.startsWith("over "));
      if (!key) return o;

      return {
        ...o,
        isCompleted: isOverCompleted(o)
          ? "Completed"
          : o.isCompleted,
      };
    });

    /* ---------------- START NEXT OVER ---------------- */
    if (isOverCompleted(over)) {
      const nextIdx = overs.findIndex(o => o.isCompleted === "Pending");
      if (nextIdx !== -1) {
        overs[nextIdx].isCompleted = "Start";
      }
    }

    /* ---------------- INNINGS CHECK ---------------- */
    const wickets = calculateTotalWickets(overs);
    const totalRuns = calculateTotalScore(overs);
    const allOut = wickets >= MAX_WICKETS;
    const inningsDone = isInningsCompleted(overs);

    /* -------- END 1ST INNING -------- */
    if (
      prev.currentInning === 1 &&
      (allOut || inningsDone)
    ) {
      return {
        ...prev,
        currentInning: 2,
        target: totalRuns + 1,
        firstInning: overs.map(o => ({
          ...o,
          isCompleted: "Completed",
        })),
        secondInning: createOvers(overs.length),
      };
    }

    /* -------- END 2ND INNING -------- */
    if (
      prev.currentInning === 2 &&
      (
        allOut ||
        inningsDone ||
        totalRuns >= prev.target   // ✅ TARGET REACHED
      )
    ) {
      return {
        ...prev,
        secondInning: overs.map(o => ({
          ...o,
          isCompleted: "Completed",
        })),
      };
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

const reassignOverStatuses = (overs) => {
  let startAssigned = false;

  return overs.map(over => {
    const overKey = Object.keys(over).find(k => k.startsWith("over "));
    if (!overKey) return over;

    const balls = over[overKey];
    const completed = isOverCompleted({ [overKey]: balls });

    if (!completed && !startAssigned) {
      startAssigned = true;
      return {
        ...over,
        isCompleted: "Start",
      };
    }

    return {
      ...over,
      isCompleted: completed ? "Completed" : "Pending",
    };
  });
};


const saveEditedBall = ({
  overNumber,
  ballIndex,
  run,
  extra,
  isWicket,
}) => {
  const overKey = `over ${overNumber}`;

  setMatchData(prev => {
    if (!prev) return prev;

    // 🚫 STOP editing if match finished
    if (
      prev.currentInning === 2 &&
      isInningsCompleted(prev.secondInning)
    ) {
      return prev;
    }

    const inningKey =
      prev.currentInning === 1 ? "firstInning" : "secondInning";

    /* ---------- UPDATE BALL ---------- */
    let updatedOvers = prev[inningKey].map(over => {
      if (!over.hasOwnProperty(overKey)) return over;

      const balls = [...over[overKey]];

      const extraRun =
        extra === "Wide" || extra === "No Ball" ? 1 : 0;

      balls[ballIndex] = {
        run,
        ...(extra && { extra, extraRun }),
        ...(isWicket && { wicket: true }),
      };

      return {
        ...over,
        [overKey]: balls,
      };
    });

    /* ---------- REASSIGN OVER STATUS ---------- */
    updatedOvers = reassignOverStatuses(updatedOvers);

    /* ---------- RECALCULATE ---------- */
    const wickets = calculateTotalWickets(updatedOvers);
    const runs = calculateTotalScore(updatedOvers);
    const inningsDone = isInningsCompleted(updatedOvers);
    const allOut = wickets >= MAX_WICKETS;

    /* ---------- END 1ST INNING ---------- */
    if (
      prev.currentInning === 1 &&
      (inningsDone || allOut)
    ) {
      return {
        ...prev,
        currentInning: 2,
        target: runs + 1,
        firstInning: updatedOvers.map(o => ({
          ...o,
          isCompleted: "Completed",
        })),
        secondInning: createOvers(updatedOvers.length),
      };
    }

    /* ---------- END 2ND INNING ---------- */
    if (
      prev.currentInning === 2 &&
      (inningsDone || allOut)
    ) {
      return {
        ...prev,
        secondInning: updatedOvers.map(o => ({
          ...o,
          isCompleted: "Completed",
        })),
      };
    }

    /* ---------- NORMAL UPDATE ---------- */
    return {
      ...prev,
      [inningKey]: updatedOvers,
    };
  });
};


  /* ------------------ UI ------------------ */
  
  const { completedOvers, ballsInCurrentOver, oversFormatted } = getOversAndBalls(currentOvers);
  const sortedOversDesc = [...currentOvers].sort((a, b) => {
    const aKey = Object.keys(a).find(k => k.startsWith("over "));
    const bKey = Object.keys(b).find(k => k.startsWith("over "));

    const aNum = Number(aKey.split(" ")[1]);
    const bNum = Number(bKey.split(" ")[1]);

    return bNum - aNum; // 🔽 descending
  });

  const canEditOver = (overInning) => {
    if (!matchData) return false;

    // match finished → no editing
    if (matchResult && matchResult !== "ONGOING") return false;

    // only current inning editable
    return matchData.currentInning === overInning;
  };

  const displayOvers = useMemo(() => {
  if (!matchData) return [];

  const i1 = sortOversDesc(matchData.firstInning).map(o => ({
    ...o,
    __inning: 1,
  }));

  const i2 = sortOversDesc(matchData.secondInning).map(o => ({
    ...o,
    __inning: 2,
  }));

  // Inning 1 → only show inning 1
  if (matchData.currentInning === 1) {
    return i1;
  }

  // Inning 2 → inning 2 first, inning 1 below
  return [...i2, ...i1];
}, [matchData]);

const inning1Overs = displayOvers
  .filter(o => o.__inning === 1 && hasAnyBall(o))
  .sort((a, b) => {
    const aNum = Number(Object.keys(a).find(k => k.startsWith("over ")).split(" ")[1]);
    const bNum = Number(Object.keys(b).find(k => k.startsWith("over ")).split(" ")[1]);
    return bNum - aNum; // latest first
  });

const inning2Overs = displayOvers
  .filter(o => o.__inning === 2 && hasAnyBall(o))
  .sort((a, b) => {
    const aNum = Number(Object.keys(a).find(k => k.startsWith("over ")).split(" ")[1]);
    const bNum = Number(Object.keys(b).find(k => k.startsWith("over ")).split(" ")[1]);
    return bNum - aNum;
  });


  return (
      <>
      {Array.isArray(matchData?.firstInning) && matchData.firstInning.length > 0 && (
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
        <div className={`d-flex mb-3 ${styles.scoreSticky}`}>                    
            <div className={`${styles.scoreContainer}`}>
                <div className={styles.scoreIn}>Inning {matchData?.currentInning}</div>
                <div className="d-flex">
                    <div className={`flex-fill text-center border-right ${styles.borderScore}`}>
                      <p className={`${styles.span} mb-0`}>Run</p> 
                      <p className={`mb-0 ${styles.scoreMain}`} style={{color: "#111827"}}>{calculateTotalScore(currentOvers)} /
                        <span className={styles.wicket}>{calculateTotalWickets(currentOvers)}</span>
                      </p>
                      
                    </div>
                    <div className={`flex-fill text-center border-left-0 ${styles.borderScore}`}>
                      <p className={`${styles.span} mb-0`}>Over</p> 
                      <p className={`mb-0 ${styles.scoreMain}`} style={{color: "#111827"}}>{oversFormatted}</p>
                    </div>
                </div>
                {matchData.currentInning === 2 && (
                    <div className={styles.target}>
                      <p className={`mb-0 ${styles.scoreMain} text-center`}>
                        Target({matchData.target})
                      </p>
                    </div>
                )}
            </div>            
            <div className="ms-3">
              <Button
              color="success"
              variant="contained"
              onClick={() => setConfirmReset(true)}
              >
              {isMatchFinished ? "Start New Match" : "Reset"}
              </Button>
            </div>
        </div>   
        {(matchData.currentInning === 2 && !isMatchFinished) && (
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
              <Grid size={{ xs: 3, md: "grow" }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  onClick={() => {
                    setExtra(null);      // no extra
                    setIsWicket(true);  // mark wicket
                    setExtraDialog(true);
                  }}
                >
                  Wicket
                </Button>
              </Grid>
            </Grid>

            {/* Runs */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              {Array.from({ length: MAX_RUN }, (_, i) => (
                <Grid key={i} size={{ xs: 3, md: "grow" }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    // disabled={disableRunButtons}
                    onClick={() => addRun(i)}
                  >
                    {i}
                  </Button>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 3 }} />
            {/* ---------------- INNING 2 OVERS (TOP ROW) ---------------- */}
            {inning2Overs.length > 0 && (
              <>
                <h6 className="mb-2">2nd Inning</h6>
                <div className={styles.oversRow}>
                  {inning2Overs.map((item) => {
                    const key = Object.keys(item).find(k => k.startsWith("over "));
                    const overNumber = Number(key.split(" ")[1]);

                    return (
                      <div key={`2-${key}`} className={styles.overItem}>
                        <OverComponent
                          data={item}
                          over={overNumber}
                          inning={2}
                          editable={canEditOver(2)}
                          onEditBall={(ballIndex, ball) => {
                            if (!canEditOver(2)) return;

                            setEditContext({ overKey: key, ballIndex, ball });
                            setExtra(ball.extra || null);
                            setIsWicket(!!ball.wicket);
                            setEditDialog(true);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ---------------- INNING 1 OVERS (BOTTOM ROW) ---------------- */}
            {inning1Overs.length > 0 && (
              <>
                <h6 className="mt-4 mb-2">1st Inning</h6>
                <div className={styles.oversRow}>
                  {inning1Overs.map((item) => {
                    const key = Object.keys(item).find(k => k.startsWith("over "));
                    const overNumber = Number(key.split(" ")[1]);

                    return (
                      <div key={`1-${key}`} className={styles.overItem}>
                        <OverComponent
                          data={item}
                          over={overNumber}
                          inning={1}
                          editable={canEditOver(1)}
                          onEditBall={(ballIndex, ball) => {
                            if (!canEditOver(1)) return;

                            setEditContext({ overKey: key, ballIndex, ball });
                            setExtra(ball.extra || null);
                            setIsWicket(!!ball.wicket);
                            setEditDialog(true);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
       
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

      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogContent>
          <Grid container spacing={2}>
            {Array.from({ length: MAX_RUN }, (_, i) => (
              <Grid key={i} size={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    if (!editContext) return;

                    saveEditedBall({
                      overNumber: Number(editContext.overKey.split(" ")[1]),
                      ballIndex: editContext.ballIndex,
                      run: i,
                      extra,
                      isWicket,
                    });

                    setEditDialog(false);
                    setExtra(null);
                    setIsWicket(false);
                  }}
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

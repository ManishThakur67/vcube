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

const MAX_RUN = 7;

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

const OverCalculator = ({ overData }) => {
  const [runTypes, setRunTypes] = useState([]);
  const [matchData, setMatchData] = useState(null);
  const [ongoingOver, setOngoingOver] = useState(null);

  const [extra, setExtra] = useState(null);
  const [extraDialog, setExtraDialog] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const resetMatch = () => {
  setMatchData(null);
  setOngoingOver(null);
  setExtra(null);
  setExtraDialog(false);

  // clear storage
  localStorage.removeItem("matchData");
  localStorage.removeItem("overData");
  localStorage.removeItem("first_inning_score");
};


  /* ---------- load run types ---------- */
  useEffect(() => {
    getRunTypes().then(setRunTypes);
  }, []);

  /* ---------- initialize match ---------- */
  useEffect(() => {
    if (!overData) return;
    setMatchData(overData);
  }, [overData]);

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
    setMatchData((prev) => {
      if (!prev) return prev;

      const inningKey =
        prev.currentInning === 1 ? "firstInning" : "secondInning";

      let overs = prev[inningKey].map((o) =>
        o.hasOwnProperty(Object.keys(updatedOver)[0])
          ? {
              ...o,
              ...updatedOver,
              isCompleted: isOverCompleted(updatedOver)
                ? "Completed"
                : "Start",
            }
          : o
      );

      /* start next over */
      if (isOverCompleted(updatedOver)) {
        const nextIdx = overs.findIndex(
          (o) => o.isCompleted === "Pending"
        );

        if (nextIdx !== -1) {
          overs = overs.map((o, i) =>
            i === nextIdx ? { ...o, isCompleted: "Start" } : o
          );
        } else {
          /* inning completed */
        if (prev.currentInning === 1) {
            const firstInningScore = calculateTotalScore(overs);
            const target = firstInningScore + 1;

            return {
                ...prev,
                currentInning: 2,
                target,                    // 👈 ADD THIS
                firstInning: overs,
                secondInning: createOvers(overs.length),
            };
        }

          return prev; // match finished
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



  /* ------------------ UI ------------------ */

  return (
    <>
      {matchData && (
        <>
        <div className="d-flex">            
            <h3 className="flex-grow-1">
                Inning: {matchData?.currentInning} | 
                Score: {calculateTotalScore(currentOvers)}

                {matchData.currentInning === 2 && (
                    <>
                    {" "} | To Win: {matchData.target}
                    </>
                )}
            </h3>
            {matchData.currentInning === 2 && (
                <h4>
                    {runsRemaining > 0
                    ? `Need ${runsRemaining} runs to win`
                    : "Match Won 🎉"}
                </h4>
            )}
            {isMatchFinished && (
            <Button
            color="success"
            variant="contained"
            onClick={() => setConfirmReset(true)}
            >
            New Match
            </Button>
            )}
        </div>        


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

          <Divider sx={{ my: 3 }} />

          {/* Run Types */}
          <Grid container spacing={2}>
            {runTypes.map((r) => (
              <Grid key={r.id} size={{ xs: 6, md: "grow" }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  onClick={() => {
                    setExtra(r.value);
                    setExtraDialog(true);
                  }}
                >
                  {r.value}
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Runs */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            {Array.from({ length: MAX_RUN }, (_, i) => (
              <Grid key={i} size={{ xs: 6, md: "grow" }}>
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

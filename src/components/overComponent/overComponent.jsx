import { Avatar } from "@mui/material";
import React from "react";
import styles from "./overComponent.module.scss";

const EXTRA = {
  Byes: "b",
  Declare: "d",
  "Leg Byes": "lb",
  "No Ball": "nb",
  Wide: "wd",
};

const OverComponent = ({ data, over, editable, inning, onEditBall }) => {
  const overKey = `over ${over}`;
  const balls = data?.[overKey];

  if (!balls || data.isCompleted === "Pending") return null;

  const statusLabel =
    data.isCompleted === "Completed" ? " (Completed)" : "";

  const getBallStyle = (ball) => {
    if (ball.wicket) {
      return { bgcolor: "#f44336" }; // 🔴 wicket
    }

    if (ball.extra) {
      return { color: "#e3f2fd", bgcolor: "#000000"}; // ⚪ extra
    }

    if (ball.run === 6) {
      return { bgcolor: "#ffdc1f", color: '#000000'}; // 🟡 six
    }

    if (ball.run === 4) {
      return { bgcolor: "#296a2c" }; // 🟢 four
    }

    return {bgcolor: "#e3f2fd", color: "#000000"};
  };

  const renderBall = (ball) => {
    let text = "";

    if (ball.extra) {
      if(ball.run) text += `${EXTRA[ball.extra]} ${ball.run}`;
      else text += `${EXTRA[ball.extra]}`;
    } else text += ball.run;    

    if (ball.wicket) {
      if(ball.run) text += " W";
      else text = "W"
    }

    return text;
  };

  const overStats = balls.reduce(
    (acc, ball) => {
      acc.runs += (ball.run || 0) + (ball.extraRun || 0);
      if (ball.wicket) acc.wickets += 1;
      return acc;
    },
    { runs: 0, wickets: 0 }
  );

  return (
    <div
      className={`${styles.overContainer} ${
        inning === 1 ? styles.inning1 : styles.inning2
      }`}
    >
      <div className={styles.overHeader}>
        <strong>
          <p className="mb-1">
            Over {over}
            {statusLabel} - ({overStats.runs}/<span style={{color: "red"}}>{overStats.wickets}</span>)
            {!editable && " 🔒"}
          </p>
        </strong>
      </div>

      <div className={`d-flex flex-wrap ${styles.Overend}`}>
        {[...balls].reverse().map((ball, rIndex) => {
        const originalIndex = balls.length - 1 - rIndex;

        return (
          <div className={styles.overGrid} key={originalIndex}>
            <Avatar
              onClick={() => {
                if (!editable) return;
                onEditBall?.(originalIndex, ball);
              }}
              sx={{
                width: 30,
                height: 30,
                fontSize: 12,
                fontWeight: "bold",
                cursor: editable ? "pointer" : "not-allowed",
                opacity: editable ? 1 : 0.8,
                ...getBallStyle(ball),
              }}
            >
              {renderBall(ball)}
            </Avatar>
          </div>
        );
      })}

      </div>
    </div>
  );
};

export default React.memo(OverComponent);

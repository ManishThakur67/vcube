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
            {statusLabel}
          </p>
        </strong>

        <span className={styles.inningBadge}>
          INN {inning}
          {!editable && " 🔒"}
        </span>
      </div>

      <div className="d-flex flex-wrap">
        {balls.map((ball, index) => (
          <div className={styles.overGrid} key={index}>
            <Avatar
              onClick={() => {
                if (!editable) return;
                onEditBall?.(index, ball);
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
        ))}
      </div>
    </div>
  );
};

export default React.memo(OverComponent);

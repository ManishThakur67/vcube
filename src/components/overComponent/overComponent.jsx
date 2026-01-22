import { Avatar } from "@mui/material";
import React from "react";
import styles from "./overComponent.module.scss";

const EXTRA = {
  Byes: "b",
  Declare: "d",
  "Leg Byes": "lb",
  "No Ball": "n",
  Wide: "w",
};

const OverComponent = ({ data, over, onEditBall }) => {
  const overKey = `over ${over}`;
  const balls = data?.[overKey];
  const statusLabel =
  data.isCompleted === "Completed" ? " (Completed)" : "";

  if (!balls || data.isCompleted === "Pending") return null;


  const getBallStyle = (ball) => {
  // Extra → white
  if (ball.extra) {
    return {
      color: "#6d6d6d",
    };
  }

  // Six → yellow
  if (ball.run === 6) {
    return {
      color: "#b39700",
    };
  }

  // Four → green
  if (ball.run === 4) {
    return {
      color: "#296a2c",
    };
  }

  // wicket ball → green
  if (ball.wicket) {
    return {
      color: "#f44336",
    };
  }
};


  const renderBall = (ball) => {
    let text = "";

    if (ball.extra) {
      text += `${EXTRA[ball.extra]}${ball.run}`;
    } else {
      text += ball.run;
    }

    if (ball.wicket) {
      text += " W";
    }

    return text;
  };


  return (
    <div>
      <strong>
        <p>{`Over ${over}  ${statusLabel}`}</p>
      </strong>

      <div className="d-flex flex-wrap">
        {balls.map((ball, index) => (
          <div className={styles.overGrid} key={index}>
            <Avatar
              onClick={() => onEditBall?.(index, ball)}
              sx={{
                width: 30,
                height: 30,
                fontSize: 12,
                cursor: "pointer",
                bgcolor: "#e3f2fd",
                color: "#000000",
                fontWeight: "bold",
                ...getBallStyle(ball)
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

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

const OverComponent = ({ data, over }) => {
  const overKey = `over ${over}`;
  const balls = data?.[overKey];
  const statusLabel =
  data.isCompleted === "Completed" ? " (Completed)" : "";

  if (!balls || data.isCompleted === "Pending") return null;


  const getBallStyle = (ball) => {
  // Extra → white
  if (ball.extra) {
    return {
      bgcolor: "#000000",
      color: "#ffffff",
      border: "1px solid #ccc",
    };
  }

  // Six → yellow
  if (ball.run === 6) {
    return {
      bgcolor: "#FFD700",
      color: "#000000",
    };
  }

  // Four → green
  if (ball.run === 4) {
    return {
      bgcolor: "#4CAF50",
      color: "#ffffff",
    };
  }

  // dot ball → green
  if (ball.run === 0) {
    return {
      bgcolor: "#cccccc",
      color: "#000000",
    };
  }

  // Default → red
  return {
    bgcolor: "#f44336",
    color: "#ffffff",
  };
};


  const renderBall = (ball) => {
    if (ball.extra) {
      return `${EXTRA[ball.extra]}${ball.run}`;
    }
    return ball.run;
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
              sx={{
                width: 30,
                height: 30,
                fontSize: 12,
                fontWeight: "bold",
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

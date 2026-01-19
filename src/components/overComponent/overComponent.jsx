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

  console.log("OverComponent render", over);

  const renderBall = (ball) => {
    if (ball.extra) {
      return `${EXTRA[ball.extra]}${ball.run}`;
    }
    return ball.run;
  };

  return (
    <div>
      <strong>
        <p>{`Over ${over} - ${statusLabel}`}</p>
      </strong>

      <div className="d-flex flex-wrap">
        {balls.map((ball, index) => (
          <div className={styles.overGrid} key={index}>
            <Avatar
              sx={{
                width: 30,
                height: 30,
                fontSize: 12,
                color: "#000000",
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

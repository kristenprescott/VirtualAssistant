import "./Clock.css";
import React, { useEffect, useState } from "react";

const date = new Date();
export default function Clock() {
  const [dateTime, setDateTime] = useState({
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();

      setDateTime({
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="Clock">
      <div className="clock-face">
        <div className="hours time">{dateTime.hours}</div>
        <span className="blink-text">:</span>
        <div className="mins time">{dateTime.minutes}</div>
        <span className="blink-text">:</span>
        <div className="secs time">{dateTime.seconds}</div>
      </div>
    </div>
  );
}

<div id="clockbox"></div>;

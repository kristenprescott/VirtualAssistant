import "./Timer.css";
import { useState, useEffect } from "react";

const Timer = () => {
  //   const [timer, setTimer] = useState(null);
  const [seconds, setSeconds] = useState(0);
  //   const [minutes, setMinutes] = useState(0);
  //   const [hours, setHours] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(0);
    // setMinutes(0);
    // setHours(0);
    setIsActive(false);
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // const setTimer = (time) => {
  //   let interval = null;

  //   if (isActive) {
  //     interval = setInterval(() => {
  //       setSeconds((seconds) => seconds + 1);
  //     }, 1000);
  //   } else if (!isActive && seconds !== 0) {
  //     clearInterval(interval);
  //   }
  //   return () => clearInterval(interval);
  // };

  return (
    <div className="Timer">
      <h2>Timer</h2>
      <div className="seconds">{seconds}</div>
      <div>
        <button
          className={`btn btn-toggle-${isActive ? "active" : "inactive"}`}
          onClick={toggle}
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button className="reset" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};
export default Timer;

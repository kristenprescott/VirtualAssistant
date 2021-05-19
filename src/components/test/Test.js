import "./Test.css";
import Clock from "../Clock/Clock";
import Timer from "../Timer/Timer";
import Calendar from "../Calendar/Calendar";

export default function Test() {
  //

  return (
    <div className="Test">
      {/* <h1>Testing grounds for new components</h1> */}
      <div style={{ height: "100vh", margin: "0" }} className="Clock">
        <h3>Clock</h3>
        <Clock />
      </div>
      <div className="Calendar">
        <Calendar />
      </div>
      <div className="Timer">
        <Timer />
      </div>
    </div>
  );
}

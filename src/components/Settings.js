import { useSpeechSynthesis } from "react-speech-kit";
// import Clock from "../components/Clock/Clock";

export default function Settings(props) {
  //
  //   const handleClick = (e) =>{
  //       props.onClick();
  //     // () => props.speak({ text, voice, rate, pitch });
  //   }
  const { voices } = useSpeechSynthesis();
  return (
    <div className="synth instructions glass-panel" style={{ height: "372px" }}>
      {/* <Clock /> */}
      <h1 className="synth-h1">Voice Synthesizer</h1>

      <form className="synth-form">
        <div className="synth-input">
          {/* ////////////////////////////////////////////////////////////////////////// */}
          {/* <---------------------------- VOICE SELECTOR ----------------------------> */}
          {/* ////////////////////////////////////////////////////////////////////////// */}
          <label htmlFor="voice">Voices: </label>
          <div className="select-wrapper">
            <select
              className="voice-selector"
              style={{ width: "300px" }}
              id="voice"
              name="voice"
              value={props.voiceIndex || ""}
              onChange={(e) => {
                props.setVoiceIndex(e.target.value);
              }}
            >
              <option value="">
                «----------------- Select a voice -----------------»
              </option>
              {voices &&
                voices.map((option, index) => (
                  <option key={option.voiceURI} value={index}>
                    {`${option.lang} - ${option.name}`}
                  </option>
                ))}
            </select>
          </div>
        </div>
        {/* ////////////////////////////////////////////////////////////////////////// */}
        {/* <------------------------------ RATE RANGE ------------------------------> */}
        {/* ////////////////////////////////////////////////////////////////////////// */}
        <div className="synth-input">
          <label htmlFor="rate">
            Rate: <span>{props.rate}</span>
          </label>
          <input
            className="rate-range range"
            style={{ width: "300px" }}
            type="range"
            min="0.5"
            max="2"
            defaultValue="1"
            step="0.1"
            id="rate"
            onChange={(e) => {
              props.setRate(e.target.value);
            }}
          />
        </div>
        {/* /////////////////////////////////////////////////////////////////////////// */}
        {/* <------------------------------ PITCH RANGE ------------------------------> */}
        {/* /////////////////////////////////////////////////////////////////////////// */}
        <div className="synth-input">
          <label htmlFor="pitch">
            Pitch: <span>{props.pitch}</span>
          </label>
          <input
            className="pitch-range range"
            style={{ width: "300px" }}
            type="range"
            min="0"
            max="2"
            defaultValue="1"
            step="0.1"
            id="pitch"
            onChange={(e) => {
              props.setPitch(e.target.value);
            }}
          />
        </div>

        {/* //////////////////////////////////////////////////////////////////////////// */}
        {/* <----------------------------- MESSAGE EDITOR -----------------------------> */}
        {/* //////////////////////////////////////////////////////////////////////////// */}
        {/* <div className="synth-input">
          <label htmlFor="message">Message: </label>
          <textarea
            className="message-box"
            id="message"
            name="message"
            rows={3}
            value={props.text}
            onChange={(e) => {
              props.setText(e.target.value);
            }}
            style={{
              height: "75px",
              width: "300px",
              backgroundColor: "transparent",
              color: "white",
              padding: "10px",
            }}
          />
        </div> */}
        {/* //////////////////////////////////////////////////////////////////////////// */}
        {/* <------------------------------- SUBMIT BTN -------------------------------> */}
        {/* //////////////////////////////////////////////////////////////////////////// */}
        {/* <div className="speak-toggle-btn btn">
          {props.speaking ? (
            <button type="button" onClick={props.cancel}>
              Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClick}
            >
              Speak
            </button>
          )}
        </div>
      */}
      </form>

      <p>When you're finished here, just say "Hide settings"</p>
    </div>
  );
}

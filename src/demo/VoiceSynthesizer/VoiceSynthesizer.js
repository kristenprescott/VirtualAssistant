import { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import "../VoiceSynthesizer/VoiceSynthesizer.css";

export default function VoiceSynthesizer() {
  ///////////
  // STATE //
  ///////////
  const [text, setText] = useState(
    "Hello, I'm a virtual assistant. How can I help you?"
  );
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(null);
  ///////////////
  // VARIABLES //
  ///////////////
  const onEnd = () => {
    // You could do something here after speaking has finished
  };
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });
  const voice = voices[voiceIndex] || null;

  return (
    <div className="synth instructions glass-panel" style={{ height: "372px" }}>
      <h1 className="synth-h1">Voice Synthesizer</h1>

      <form className="synth-form">
        {/* <------VOICE SELECTOR------> */}
        <div className="synth-input">
          <label htmlFor="voice">Voices: </label>
          <div className="select-wrapper">
            <select
              className="voice-selector"
              style={{ width: "300px" }}
              id="voice"
              name="voice"
              value={voiceIndex || ""}
              onChange={(e) => {
                setVoiceIndex(e.target.value);
              }}
            >
              <option value="">
                «----------------- Select a voice -----------------»
              </option>
              {voices.map((option, index) => (
                <option key={option.voiceURI} value={index}>
                  {`${option.lang} - ${option.name}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* <------RATE SELECTOR------> */}
        <div className="synth-input">
          <label htmlFor="rate">
            Rate: <span>{rate}</span>
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
              setRate(e.target.value);
            }}
          />
        </div>

        {/* <------PITCH SELECTOR------> */}
        <div className="synth-input">
          <label htmlFor="pitch">
            Pitch: <span>{pitch}</span>
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
              setPitch(e.target.value);
            }}
          />
        </div>

        {/* <------MESSAGE EDITOR------> */}
        <div className="synth-input">
          {/* <div> */}
          <label htmlFor="message">Message: </label>
          <textarea
            className="message-box"
            id="message"
            name="message"
            rows={3}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            style={{
              height: "75px",
              width: "300px",
              backgroundColor: "transparent",
              color: "white",
              padding: "10px",
            }}
          />
        </div>

        {/* <------SUBMIT BUTTON------> */}
        <div className="speak-toggle-btn btn">
          {speaking ? (
            <button type="button" onClick={cancel}>
              Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={() => speak({ text, voice, rate, pitch })}
            >
              Speak
            </button>
          )}
        </div>
      </form>

      <p>When you're finished here, just say "Back to demo."</p>
    </div>
  );
}

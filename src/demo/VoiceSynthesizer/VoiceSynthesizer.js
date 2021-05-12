import { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

export default function VoiceSynthesizer() {
  ///////////
  // STATE //
  ///////////
  const [text, setText] = useState(
    "Hello, I'm a virtual assistant. How can I help you?"
  );
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [selection, setSelection] = useState(null);
  ///////////////
  // VARIABLES //
  ///////////////
  const onEnd = () => {
    // You could do something here after speaking has finished
  };
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });
  const voice = voices[selection] || null;

  return (
    <div className="synth instructions glass-panel" style={{ height: "300px" }}>
      <p>Voice Synthesizer</p>

      <form>
        {/* <------VOICE SELECTOR------> */}
        <label htmlFor="voice">Voices: </label>
        <select
          id="voice"
          name="voice"
          value={selection || ""}
          onChange={(e) => {
            setSelection(e.target.value);
          }}
        >
          <option value="">-------Choose a voice-------</option>
          {voices.map((choice, i) => {
            <option
              key={choice.voiceURI}
              value={i}
            >{`${choice.lang} - ${choice.name}`}</option>;
          })}
        </select>
        {/* <------RATE SELECTOR------> */}
        <div>
          <label htmlFor="rate">
            Rate: <span>{rate}</span>
          </label>
          <input
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
        <div>
          <label htmlFor="pitch">
            Pitch: <span>{pitch}</span>
          </label>
          <input
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
        <div style={{ backgroundColor: "transparent" }}>
          {/* <div> */}
          <label htmlFor="message">Message: </label>
          <textarea
            contentEditable
            id="message"
            name="message"
            rows={3}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            style={{
              height: "75px",
              backgroundColor: "transparent",
              color: "white",
              padding: "10px",
            }}
          />
        </div>
        {/* <------SUBMIT BUTTON------> */}
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
      </form>

      <p>When you're finished here, just say "Back to demo."</p>
    </div>
  );
}

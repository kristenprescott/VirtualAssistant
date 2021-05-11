import micOn from "../../assets/images/icons/mic_on.png";
import micOff from "../../assets/images/icons/mic_off.png";
import "../Permission/Permission.css";
import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Permission() {
  // FUNCTIONS

  // callback function to move to next page after permission is granted
  // VARIABLES
  const commands = [
    {
      command: "OK",
      callback: () => setDisplay(),
    },
    {
      command: "My name is *",
      callback: (name) =>
        setDisplay(`Hello, ${name}! I hope to remember that in the future.`),
    },
    {
      command: ["reset", "clear"],
      callback: () => resetTranscript(),
    },
    {
      command: "clear",
      callback: ({ resetTranscript }) => resetTranscript(),
    },
    {
      command: ["quit", "end", "exit"],
      callback: () => SpeechRecognition.stopListening(),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true,
    },
    {
      command: "help",
      callback: () => setMessage(),
    },
  ];

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });

  // HOOKS
  const [display, setDisplay] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  // const [note, setNote] = useState("");

  useEffect(() => {
    if (finalTranscript !== "") {
      console.log("Transcript:", finalTranscript);
      setText(finalTranscript);
    }
  }, [interimTranscript, finalTranscript]);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log(
      "I'm sorry - This browser does not support speech recognition software."
    );
  }

  // LISTENERS
  const listenContinuously = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.value);
  };

  const handleClick = () => {
    console.log("button clicked");
  };

  return (
    <div className="page" id="Permission">
      {/* ASSISTANT IMG */}
      <div className="virtual-assistant-container">
        <div className="virtual-assistant"></div>
        {/* <img
          src=""
          style={{
            width: "300px",
            height: "300px",
            borderRadius: "150px",
            backgroundColor: "gainsboro",
          }}
        ></img> */}
      </div>

      <div className="main">
        <textarea className="instructions glass-panel">
          Hello, I'm a virtual assistant. To give me permission to listen to
          you, tap the circle below. Then, hold down the button and say "OK"
        </textarea>

        {/* RESPONSE DISPLAY */}
        <div className="message-display-container glass-panel">
          {/* MESSAGE BOX */}
          <span>
            <strong>message{message}</strong>
          </span>
          <textarea className="message-textbox" placeholder={display}>
            {display}
          </textarea>

          <button className="message-clear-btn" onClick={() => setDisplay("")}>
            Clear
          </button>
        </div>

        <div className="form-container glass-panel">
          <form onSubmit={handleSubmit}>
            {/* SPOKEN TEXT */}
            <textarea
              className="transcript"
              value={transcript}
              onChange={handleChange}
              //   placeholder={transcript}
            />{" "}
            {/* HOT MIC "BTN" */}
            <div className="">
              <img
                src={listening ? micOn : micOff}
                alt=""
                style={{ with: "38px", height: "38px", margin: "5px" }}
              />
            </div>
            {/* LISTEN BTN */}
            <button
              onMouseDown={listenContinuously}
              onMouseUp={SpeechRecognition.stopListening}
              style={{
                width: "50px",
                height: "50px",
                border: "none",
                borderRadius: "30px",
                backgroundColor: "lightgray",
                cursor: "pointer",
              }}
            >
              🎤
            </button>
            {/* HIDDEN BTN (i forgot what its for) */}
            <input
              type="submit"
              value=""
              onClick={handleClick}
              style={{ border: "none" }}
            />
          </form>
        </div>
      </div>
      {
        // https://stackoverflow.com/questions/58116211/how-to-redirect-to-another-page-on-button-click-in-reactjs
      }
    </div>
  );
}

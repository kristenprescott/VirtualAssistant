import micOn from "../../assets/images/icons/mic_on.png";
import micOff from "../../assets/images/icons/mic_off.png";
import "../Permission/Permission.css";
import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Permission() {
  ///////////
  // STATE //
  ///////////
  // const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [active, setActive] = useState(false);
  ///////////////
  // VARIABLES //
  ///////////////

  const commands = [
    {
      command: ["hello", "hi"],
      callback: () => setMessage("Hello, how can I help you?"),
      matchInterim: true,
      bestMatchOnly: true,
    },
    {
      command: "(hello) my name is *",
      callback: (name) =>
        setMessage(`Hello, ${name}! I hope to remember that in the future.`),
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
      callback: () => setMessage("How can I help you?"),
    },
    {
      command: ["log in", "login"],
      callback: () => {
        window.open("http://localhost:3000/login", "_self");
      },
    },
    {
      command: "demo",
      callback: () => {
        window.open("http://localhost:3000/demo", "_self");
      },
    },
  ];

  const {
    transcript,
    // interimTranscript,
    // finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });
  ///////////
  // HOOKS //
  ///////////
  // useEffect(() => {
  //   if (finalTranscript !== "") {
  //     console.log("Transcript:", finalTranscript);
  //     setText(finalTranscript);
  //   }
  // }, [interimTranscript, finalTranscript]);

  useEffect(() => {
    // SpeechRecognition.startListening({ continuous: true });
    SpeechRecognition.startListening();
  }, []);
  ////////////////////
  // EVENT HANDLERS //
  ////////////////////
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

  const handleActive = () => {
    if (active === false) {
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
      });
      setActive(true);
    }
    if (active === true) {
      SpeechRecognition.stopListening();
      setActive(false);
    }
  };

  // const handleMouseDown = () => {
  //   setActive(!isActive);
  // };

  // const handleMouseUp = () => {
  //   setActive(isActive);
  // };

  return (
    <div className="page" id="Permission">
      <div className="center-col virtual-assistant-container">
        <div
          className="virtual-assistant"
          // className={active ? "virtual-assistant" : "virtual-assistant-active"}
        ></div>
      </div>

      <div className=" center-col main">
        <div className="">
          <div className="instructions glass-panel">
            <p>
              Hello, I'm a virtual assistant. To allow microphone access, tap
              the button below.
            </p>
            <p>
              I can take you to the log in page or show you a demo. Which would
              you prefer?
            </p>
            <p>To log in say "Log in."</p>
            <p>To take a tour, say "Demo."</p>
          </div>
        </div>

        {/* RESPONSE DISPLAY */}
        <div className="message-display-container">
          <textarea
            style={{ width: "500px" }}
            className="message-textbox glass-panel"
            placeholder={message}
          >
            {message}
          </textarea>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            {/* SPOKEN TEXT */}
            <textarea
              className="transcript glass-panel"
              value={transcript}
              onChange={handleChange}
            />{" "}
            {/* HOT MIC "BTN" */}
            <div
              className="center-col buttons"
              style={{ position: "relative", margin: "10px" }}
            >
              <div className="hot-mic-btn">
                <img
                  src={listening ? micOn : micOff}
                  alt=""
                  style={{
                    top: "0",
                    positon: "absolute",
                    width: "70px",
                    height: "70px",
                  }}
                />
              </div>
              {/* LISTEN BTN */}
              <button
                // className={isActive ? "blob" : "mic"}
                onChange={handleActive}
                onMouseDown={listenContinuously}
                onMouseUp={SpeechRecognition.stopListening}
                style={{
                  top: "10px",
                  position: "absolute",
                  width: "50px",
                  height: "50px",
                  border: "none",
                  borderRadius: "30px",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
              >
                🎤
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
//////////////////////////////////////////////////////////////////////////////
// <---------------------- CREATE FALLBACK BEHAVIOR ----------------------> //
//////////////////////////////////////////////////////////////////////////////
/*
  if (SpeechRecognition.browserSupportsSpeechRecognition()) {
    // continue
  } else {
    // Fallback behavior
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log(
      "I'm sorry - This browser does not support speech recognition software."
    );
  }

    if (browserSupportsContinuousListening) {
    SpeechRecognition.startListening({ continuous: true });
  } else {
    // Fallback behaviour
  }
*/

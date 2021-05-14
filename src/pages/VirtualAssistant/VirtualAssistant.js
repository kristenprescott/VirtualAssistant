import micOn from "../../assets/images/icons/mic_on.png";
import micOff from "../../assets/images/icons/mic_off.png";
import "./VirtualAssistant.css";
import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";

export default function VirtualAssistant() {
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------------ STATE ------------------------------------------> //
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const [text, setText] = useState("Hello there");
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(null);

  const [message, setMessage] = useState("");
  // const [isListening, setIsListening] = useState(false);

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // <---------------------------------------- VARIABLES ----------------------------------------> //
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const onEnd = () => {
    // You could do something here after speaking has finished
  };
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });
  const voice = voices[1] || null;

  const commands = [
    {
      command: ["hello", "hi"],
      callback: () => {
        setMessage("Hello, how can I help you?");
        speak({ text: "Hello, how can I help you?", voice, rate, pitch });
      },
      // matchInterim: true,
      // bestMatchOnly: true,
    },
    {
      command: "(hello) my name is *",
      callback: (name) => {
        setMessage(`Hello, ${name}! I hope to remember that in the future.`);
        speak({
          text: `Hello, ${name}! I hope to remember that in the future.`,
          voice,
          rate,
          pitch,
        });
      },
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
      callback: () => {
        setMessage("How can I help you?");
        speak({ text: "How can I help you?", voice, rate, pitch });
      },
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
    {
      command: "(go) back",
      callback: () => {
        window.history.history.go(-1);
      },
    },
    {
      command: "(go) forward",
      callback: () => {
        window.history.go(1);
      },
    },
    {
      command: "open webpage *",
      callback: (website) => {
        window.open("http://" + website.split(" ").join("") + ".com");
      },
    },
    {
      command: "search google for *",
      callback: (searchTerm) => {
        window.open(`http://www.google.com/search?q=${searchTerm}`);
      },
    },
    {
      command: "up up down down left right left right b a (start)",
      callback: () => {
        setMessage("nerd.");
      },
    },
    {
      command: "google search exact *",
      callback: (exactTerm) => {
        window.open(`http://www.google.com/search?q="${exactTerm}"`);
      },
    },
    {
      command: "go to voice synthesizer",
      callback: () => {
        window.open("http://localhost:3000/voicesynthesizer", "_self");
      },
    },
  ];

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------------ HOOKS ------------------------------------------> //
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   console.log("speak effect 😈");
  //   if (message) {
  //     if (!speechSynthesis.speaking) {
  //       speak({ text: message, voice, rate, pitch });
  //     }
  //   }
  // }, [message]);

  // useEffect(() => {
  //   speak({ text: "howdy", voice, rate, pitch });
  // }, []);

  // useEffect(() => {
  //   console.log("speak.");
  //   if (!speechSynthesis.speaking) {
  //     // setText(message) ONLY if !speechRecognition.listening
  //     if (!SpeechRecognition.listening) {
  //       // setMessage(finalTranscript);
  //       setText(message);
  //       // speak the text
  //     }
  //   }
  // }, [listening]);

  // useEffect(() => {
  //   if (text) {
  //     speak({ text, voice, rate, pitch });
  //   }
  // }, [text]);

  // useEffect(() => {
  //   if (finalTranscript !== "") {
  //     console.log("Transcript:", finalTranscript);
  //     setText(finalTranscript);
  //   }
  // }, [interimTranscript, finalTranscript]);

  // useEffect(() => {
  //   // SpeechRecognition.startListening({ continuous: true });
  //   SpeechRecognition.startListening();
  // }, []);
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------- EVENT HANDLERS -------------------------------------> //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const handleMouseDown = async (e) => {
    e.preventDefault();
    const VirtualAss = document.getElementsByClassName("virtual-assistant");
    VirtualAss[0].classList.remove("paused");

    await SpeechRecognition.startListening({
      continuous: false,
      language: "en-US",
    });
    // setIsListening(true);
    // SpeechRecognition.listening = true;
  };

  const handleMouseUp = async (e) => {
    e.preventDefault();

    const VirtualAss = document.getElementsByClassName("virtual-assistant");
    VirtualAss[0].classList.add("paused");

    await SpeechRecognition.stopListening();
    // setIsListening(false);
    // SpeechRecognition.listening = false;
  };

  return (
    <div className="page" id="VirtualAssistant">
      <div className="center-col virtual-assistant-container">
        <div className="paused virtual-assistant">
          {/* {transcript.toString()} */}
        </div>
      </div>

      {/* ============================================================================================================== */}
      <div className=" center-col main">
        <div className="">
          {/* ///////////////////////////////////////////////////////////////////////////// */}
          {/* <--------------------------- INSTRUCTIONS DISPLAY --------------------------> */}
          {/* ///////////////////////////////////////////////////////////////////////////// */}
          <div className="instructions glass-panel">
            <p>
              Hello, I'm a virtual assistant. To allow microphone access, press
              and hold the button below, then allow access.
            </p>
            <p>
              I can take you to the log in page or show you a demo. Which would
              you prefer?
            </p>
            <p>To log in say "Log in."</p>
            <p>To take a tour, say "Demo."</p>
          </div>
        </div>
        {/* ///////////////////////////////////////////////////////////////////////////// */}
        {/* <-------------------------- TEXT RESPONSE DISPLAY --------------------------> */}
        {/* ///////////////////////////////////////////////////////////////////////////// */}
        <div className="message-display-container">
          <textarea
            style={{ width: "500px" }}
            className="message-textbox glass-panel"
            placeholder={message}
          >
            {message}
          </textarea>
        </div>

        {/* <div className="speak-toggle-btn btn">
          {speaking ? (
            <button type="button" onClick={cancel}></button>
          ) : (
            <button
              type="button"
              onClick={() => speak({ text: "howdy", voice, rate, pitch })}
            >
              Howdy
            </button>
          )}
        </div> */}

        {/* {listening && <h1 style={{ color: "white" }}>listening</h1>} */}
        {/* {isListening && <h1 style={{ color: "white" }}>isListening!</h1>} */}
        <div className="form-container">
          <div>
            <div className="transcript-display">
              {/* ////////////////////////////////////////////////////////////////////////// */}
              {/* <------------------------------ TRANSCRIPT ------------------------------> */}
              {/* ////////////////////////////////////////////////////////////////////////// */}
              <textarea className="transcript glass-panel" value={transcript} />{" "}
            </div>
            {/* ============================================================================================================== */}
            <div
              className="center-col buttons"
              style={{ position: "relative", margin: "10px" }}
            >
              <div className="hot-mic-btn">
                {/* /////////////////////////////////////////////////////////////////////////// */}
                {/* <----------------------------- HOT MIC "BTN" -----------------------------> */}
                {/* /////////////////////////////////////////////////////////////////////////// */}
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
              {/* //////////////////////////////////////////////////////////////////////////// */}
              {/* <------------------------------- LISTEN BTN -------------------------------> */}
              {/* //////////////////////////////////////////////////////////////////////////// */}
              <button
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
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
          </div>
        </div>
      </div>
    </div>
  );
}
//////////////////////////////////////////////////////////////////////////////////////////////////
// <-------------------------------- CREATE FALLBACK BEHAVIOR --------------------------------> //
//////////////////////////////////////////////////////////////////////////////////////////////////
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

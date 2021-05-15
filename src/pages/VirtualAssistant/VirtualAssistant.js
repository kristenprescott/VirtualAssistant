import micOn from "../../assets/images/icons/mic_on.png";
import micOff from "../../assets/images/icons/mic_off.png";
import "./VirtualAssistant.css";
import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import Settings from "../../components/Settings";

export default function VirtualAssistant() {
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------------ STATE ------------------------------------------> //
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Geolocation:
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  // // Weather:
  const [weatherData, setWeatherData] = useState([]);

  // const [voiceSelector, setVoiceSelector] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  // const [text, setText] = useState("Hello there");
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
    {
      command: "show settings",
      callback: () => setShowSettings(true),
    },
    {
      command: "hide settings",
      callback: () => setShowSettings(false),
    },
    // {
    //   command: "fetch weather",
    //   callback: () => {
    //     fetchWeather().then(
    //       setMessage(
    //         `current weather is ${weatherData.current.weather[0].description}`
    //       )
    //     );
    //     speak({ text: "How can I help you?", voice, rate, pitch });
    //   },
    // },
    // {
    //   command: "current temperature",
    //   callback: () => getCurrentTemp(),
    // },
  ];

  // const getCurrentTemp = () => {
  //   fetchWeather();
  //   // {
  //   //   weatherData.current.temp
  //   //     ? speak({
  //   //         text: `the current temperature is ${weatherData.current.temp}`,
  //   //         voice,
  //   //         rate,
  //   //         pitch,
  //   //       })
  //   //     : setMessage("could not fetch data.");
  //   // }
  //   if (weatherData.current.temp) {
  //     setMessage(`the current temperature is ${weatherData.current.temp}`);
  //     speak({
  //       text: `the current temperature is ${weatherData.current.temp}`,
  //       voice,
  //       rate,
  //       pitch,
  //     });
  //   }
  // };

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
  const fetchWeather = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/onecall?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_API_KEY}&units=imperial`
    );
    console.log(res.json());
    console.log("res: ", res);
    console.log(
      `${process.env.REACT_APP_API_URL}/onecall?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_API_KEY}&units=imperial`
    );
  };
  // Fetch weather:
  useEffect(() => {
    // Geolocation:
    const fetchData = async () => {
      await navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
      // // Weather:
      // await fetch(
      //   `${process.env.REACT_APP_API_URL}/onecall?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_API_KEY}&units=imperial`
      // )
      //   .then((res) => res.json())
      //   .then((result) => {
      //     setData(result);
      //   });
    };
    fetchData();
    console.log("lat: ", lat, "long: ", long);
    // console.log(
    //   `${process.env.REACT_APP_API_URL}/onecall?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_API_KEY}&units=imperial`
    // );
  }, []);
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
  };

  const handleMouseUp = async (e) => {
    e.preventDefault();

    const VirtualAss = document.getElementsByClassName("virtual-assistant");
    VirtualAss[0].classList.add("paused");

    await SpeechRecognition.stopListening();
  };

  const settingsProps = {
    voiceIndex,
    setVoiceIndex,
    rate,
    setRate,
    pitch,
    setPitch,
    voices,
  };

  return (
    <div className="page" id="VirtualAssistant">
      <div className="center-col virtual-assistant-container">
        <div className="paused virtual-assistant">
          {/* {transcript.toString()} */}
        </div>
      </div>

      <div className=" center-col main">
        {showSettings ? (
          <Settings {...settingsProps} />
        ) : (
          <div>
            <div className="">
              {/* ///////////////////////////////////////////////////////////////////////////// */}
              {/* <--------------------------- INSTRUCTIONS DISPLAY --------------------------> */}
              {/* ///////////////////////////////////////////////////////////////////////////// */}
              <div className="instructions glass-panel">
                <p>
                  Hello, I'm a virtual assistant. To allow microphone access,
                  press and hold the button below, then allow access.
                </p>
                <p>
                  I can take you to the log in page or show you a demo. Which
                  would you prefer?
                </p>
                <p>To log in say "Log in."</p>
                <p>To take a tour, say "Demo."</p>
              </div>
            </div>
            <div className="message-display-container">
              {/* ///////////////////////////////////////////////////////////////////////////// */}
              {/* <-------------------------- TEXT RESPONSE DISPLAY --------------------------> */}
              {/* ///////////////////////////////////////////////////////////////////////////// */}
              <textarea
                style={{ width: "500px" }}
                className="message-textbox glass-panel"
                placeholder={message}
              >
                {message}
              </textarea>
            </div>
          </div>
        )}
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

      {/* ======================================================== */}
      <div
      // style={{
      //   display: "hidden",
      //   border: "none",
      // }}
      >
        {weatherData.current ? (
          <div className="data-container">
            <div className="fetched-data">
              <ul>
                Current:
                <li>dt: {weatherData.current.dt} </li>
                <li>sunrise: {weatherData.current.sunrise}</li>
                <li>sunset: {weatherData.current.sunset}</li>
                <li>temp: {weatherData.current.temp}</li>
                <li>feels_like: {weatherData.current.feels_like}</li>
                <li>pressure: {weatherData.current.pressure}</li>
                <li>humidity: {weatherData.current.humidity}</li>
                <li>dew_point: {weatherData.current.dew_point}</li>
                <li>uvi: {weatherData.current.uvi}</li>
                <li>clouds: {weatherData.current.clouds}</li>
                <li>visibility: {weatherData.current.visibility}</li>
                <li>wind_speed: {weatherData.current.wind_speed}</li>
                <li>wind_deg: {weatherData.current.wind_deg}</li>
                <li>wind_gust: {weatherData.current.wind_gust}</li>
              </ul>
            </div>
            {weatherData.current.weather.map((item, index) => (
              <ul className="data-map" key={index}>
                Weather:
                <li>id: {item.id}</li>
                <li>main: {item.main}</li>
                <li>description: {item.description}</li>
                {/* <span>icon: </span> */}
                <img
                  src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
                />
              </ul>
            ))}
          </div>
        ) : (
          <div>no current data</div>
        )}
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

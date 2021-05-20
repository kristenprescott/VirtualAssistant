import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import useCommandsModal from "./hooks/useCommandsModal";
import VirtualAssistant from "./pages/VirtualAssistant/VirtualAssistant";
import VoiceSynthesizer from "./demo/VoiceSynthesizer/VoiceSynthesizer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import TodoForm from "./pages/Todos/TodoForm";
// import SpeechContext from "./hooks/SpeechContext";
// import { useContext } from "react";

export const SpeechContext = React.createContext();
// import Test from "./components/test/Test";

function App() {
  /////////////////////////////////////////////////////////////////
  // <------------------------- STATE -------------------------> //
  /////////////////////////////////////////////////////////////////
  // time
  //////////////////////
  // const [timer, setTimer] = useState(null);
  // const [seconds, setSeconds] = useState(0);
  // const [minutes, setMinutes] = useState(0);
  // const [hours, setHours] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Geolocation:
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  // // Weather:
  const [weatherData, setWeatherData] = useState(null);

  // const [voiceSelector, setVoiceSelector] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  // const [text, setText] = useState("Hello there");
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(null);

  const [message, setMessage] = useState("");
  // const [isListening, setIsListening] = useState(false);

  //////////////////////
  // const [timer, setTimer] = useState(null);
  // const [seconds, setSeconds] = useState(0);
  // const [minutes, setMinutes] = useState(0);
  // const [hours, setHours] = useState(0);
  //
  // Seconds timer:
  const setSecondsTimer = (timeout) => {
    const countdown = parseInt(timeout) * 1000;
    console.log("countdown: ", countdown);
    setTimeout(function (countdown) {
      console.log("Timer set for: ", timeout, " seconds");

      let counter = 0;
      while (countdown > 0) {
        countdown--;
        console.log("time elapsed: ", counter);
      }
      setMessage("beep.");
      speak({ text: "beep.", voice, rate, pitch });
      return;
    }, countdown);

    console.log("setTimeout() example...");
  };
  // Minutes timer:
  const setMinutesTimer = (timeout) => {
    const countdown = parseInt(timeout) * 60000;
    console.log("countdown: ", countdown);
    setTimeout(function (countdown) {
      console.log("Timer set for: ", timeout, " minutes");
      while (countdown > 0) {
        countdown--;
        console.log(countdown);
      }
      setMessage("beep.");
      speak({ text: "beep.", voice, rate, pitch });
      return;
    }, countdown);

    console.log("setTimeout() example...");
  };
  // current time:
  const fetchTime = () => {
    const today = new Date();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // const time = new Date().getTime();
    // const time = Date.now().setSeconds(num);
    setMessage(time);
    speak({ text: `${time} seconds`, voice, rate, pitch });
  };
  // current date:
  const fetchDate = () => {
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    setMessage(date);
    speak({ text: `the date is ${date}`, voice, rate, pitch });
  };
  // current day:
  const fetchDay = () => {
    // Get the day of week, from 0 (Sunday) to 6 (Saturday).
    const today = new Date();
    const day = today.getDay();
    if (day === 0) {
      setMessage("Today is Sunday.");
      speak({ text: "sunday", voice, rate, pitch });
    } else if (day === 1) {
      setMessage("Today is Monday.");
      speak({ text: "monday", voice, rate, pitch });
    } else if (day === 2) {
      setMessage("Today is Tuesday.");
      speak({ text: "tuesday", voice, rate, pitch });
    } else if (day === 3) {
      setMessage("Today is Wednesday.");
      speak({ text: "wednesday", voice, rate, pitch });
    } else if (day === 4) {
      setMessage("Today is Thursday.");
      speak({ text: "thursday", voice, rate, pitch });
    } else if (day === 5) {
      setMessage("Today is Friday.");
      speak({ text: "friday", voice, rate, pitch });
    } else if (day === 6) {
      setMessage("Today is Saturday.");
      speak({ text: "saturday", voice, rate, pitch });
    }
  };
  // Fetch weather:
  useEffect(() => {
    // Geolocation:
    const getLocation = async () => {
      await navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
    };
    getLocation();
    // console.log("lat: ", lat, "long: ", long);
  }, []);
  /////////////////////////////////////////////////////////////////
  // <------------------ COMMAND FUNCTIONS---------------------> //
  /////////////////////////////////////////////////////////////////
  const fetchWeather = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_WEATHER_API_URL}/onecall?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=imperial`
    );
    const weather = await res.json();
    setWeatherData(weather);
    return weather;
  };

  const getCurrentWeatherDescription = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.current.weather[0].description}`;
      speak({ text: weatherText });
      setMessage(weatherText);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.current.weather[0].description}`;
        speak({ text: weatherText });
      }
    }
  };

  const getCurrentTemperature = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.current.temp.toString()} degrees`;
      speak({ text: weatherText });
      setMessage(weatherText);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.current.temp.toString()} degrees`;
        speak({ text: weatherText });
      }
    }
  };

  const getMoonPhase = async () => {
    //////////////////////////////////
    // !!!!!!!! BAD LOGIC !!!!!!!!!!!
    /////////////////////////////////
    if (weatherData) {
      // [daily.moon_phase] Moon phase. 0 and 1 are 'new moon', 0.25 is 'first quarter moon', 0.5 is 'full moon' and 0.75 is 'last quarter moon'. The periods in between are called 'waxing crescent', 'waxing gibous', 'waning gibous', and 'waning crescent', respectively.
      const phase = weatherData.daily[0].moon_phase;
      let currentPhase;
      if (phase === 0.0 || 1) {
        // "new moon"
        currentPhase = "new moon";
      } else if (phase === 0.25) {
        // "first quarter"
        currentPhase = "first quarter";
      } else if (phase === 0.5) {
        // "full moon"
        currentPhase = "full moon";
      } else if (phase === 0.75) {
        // "last quarter"
        currentPhase = "last quarter";
      } else if (0 < phase < 0.25) {
        // "waxing crescent"
        currentPhase = "waxing crescent";
      } else if (0.25 < phase < 0.5) {
        // "waxing gibous"
        currentPhase = "waxing gibous";
      } else if (0.5 < phase < 0.75) {
        // "waning gibous"
        currentPhase = "waning gibous";
      } else if (0.75 < phase < 1) {
        // "waning crescent"
        currentPhase = "waning crescent";
      }
      const weatherText = `${currentPhase}`;
      speak({ text: weatherText });
      setMessage(weatherText);
      console.log("phase: ", weatherData.daily[0].moon_phase.toString());
    } else {
      speak({ text: "cannot fetch data" });

      // const weather = await fetchWeather();
      // if (weather) {
      //   const weatherText = `${weather.daily[0].moon_phase}`;
      //   speak({ text: weatherText });
      // }
    }
  };

  // const getCurrentSunrise = async () => {
  //   ////////////////////////////////////////////
  //   // const timeConversion = new Date(
  //   //   weatherData.current.sunrise
  //   // ).toLocaleTimeString("en-US");
  //   ////////////////////////////////////////////
  //   if (weatherData) {
  //     const unixTimestamp = weatherData.current.sunrise;
  //     const date = new Date(unixTimestamp * 1e3); // 1e3 === 1000
  //     // Now you can use built-in methods to convert to a local date.
  //     const localized = date.toLocaleDateString();
  //     const weatherText = `${localized}`;
  //     speak({ text: weatherText });
  //   } else {
  //     const unixTimestamp = weather.current.sunrise;
  //     const date = new Date(unixTimestamp * 1e3); // 1e3 === 1000
  //     // Now you can use built-in methods to convert to a local date.
  //     const localized = date.toLocaleDateString();
  //     const weather = await fetchWeather();
  //     if (weather) {
  //       const weatherText = `${localized}`;
  //       speak({ text: weatherText });
  //     }
  //   }
  // };
  // COMMANDS
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
      command: "thank you",
      callback: () => {
        speak({ text: "you're welcome" });
        setMessage("You're welcome.");
      },
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
      command: ["show me my to do list", "show me my to-do list"],
      callback: () => {
        window.open("http://localhost:3000/todos", "_self");
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
        setMessage(
          "To open view all commands, say 'get commands' or simply 'commands'"
        );
        speak({
          text:
            "To open view all commands, say 'get commands' or simply 'commands'",
          voice,
          rate,
          pitch,
        });
      },
    },
    {
      command: ["(get) commands", "show commands"],
      callback: () => {
        setMessage("Opening commands.");
        speak({ text: "Opening commands.", voice, rate, pitch });
        toggle();
      },
    },
    {
      command: ["log in", "login"],
      callback: () => {
        window.open("http://localhost:3000/login", "_self");
      },
    },
    {
      command: ["log out", "logout"],
      callback: () => {
        window.open("http://localhost:3000/login", "_self");
      },
    },
    {
      command: ["register", "sign up", "signup"],
      callback: () => {
        window.open("http://localhost:3000/register", "_self");
      },
    },
    {
      command: "go to demo",
      callback: () => {
        window.open("http://localhost:3000/demo", "_self");
      },
    },
    {
      command: "go to test",
      callback: () => {
        window.open("http://localhost:3000/test", "_self");
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
    //////////////////////////////////////////
    // <--------------- TIME --------------->
    //////////////////////////////////////////
    {
      command: "set (a) timer for :timeout seconds",
      callback: (timeout) => {
        setIsActive(true);
        setSecondsTimer(timeout);
        setMessage(`Timer set for ${timeout} seconds`);
        speak({ text: `Timer set for ${timeout} seconds`, voice, rate, pitch });
      },
    },
    {
      command: [
        "set (a) timer for :timeout minutes",
        "set a timer for :timeout minute",
      ],
      callback: (timeout) => {
        setIsActive(true);
        setMinutesTimer(timeout);
        setMessage(`Timer set for ${timeout} minutes`);
        speak({ text: `Timer set for ${timeout} minutes`, voice, rate, pitch });
      },
    },
    {
      command: "what time is it",
      callback: () => fetchTime(),
    },
    {
      command: ["what is todays date", "what's the date"],
      callback: () => fetchDate(),
    },
    {
      command: "what day is it",
      callback: () => fetchDay(),
    },
    //////////////////////////////////////////
    // <-------------- WEATHER -------------->
    //////////////////////////////////////////
    {
      command: "fetch weather",
      callback: () => {
        fetchWeather();
        setMessage("weather fetched");
      },
    },
    {
      command: [
        "(current) weather",
        "what's the weather",
        "what is the weather",
        "tell me the weather",
        "how's the weather",
      ],
      callback: () => {
        if (weatherData) {
          getCurrentWeatherDescription();
        } else {
          setMessage("none");
        }
      },
    },
    {
      command: "current temperature",
      callback: () => {
        getCurrentTemperature();
      },
    },
    {
      command: [
        "(current) moon phase",
        "what's the moon phase",
        "what phase is the moon (in)",
      ],
      callback: () => {
        getMoonPhase();
      },
    },
    // {
    //   command: "current sunrise",
    //   callback: () => {
    //     getCurrentSunrise();
    //   },
    // },
  ];
  // Recog:
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });
  // Synth:
  const onEnd = () => {
    // You could do something here after speaking has finished
  };
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });
  const voice = voices[1] || null;
  const { isShowing, toggle } = useCommandsModal();
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
    <BrowserRouter>
      <SpeechContext.Provider
        value={{
          SpeechRecognition,
          useSpeechRecognition,
          useSpeechSynthesis,
          useCommandsModal,
          commands,
          toggle,
          isShowing,
          speak,
          cancel,
          speaking,
          supported,
          voices,
          onEnd,
          transcript,
          interimTranscript,
          finalTranscript,
          resetTranscript,
          listening,
          settingsProps,
        }}
      >
        <Switch>
          {/* <Route path="/" exact component={VirtualAssistant} /> */}
          <Route exact path="/">
            <VirtualAssistant
              data={
                (SpeechRecognition,
                useSpeechRecognition,
                useSpeechSynthesis,
                useCommandsModal,
                commands,
                speak,
                cancel,
                speaking,
                supported,
                voices,
                onEnd,
                transcript,
                interimTranscript,
                finalTranscript,
                resetTranscript,
                listening,
                settingsProps,
                isShowing,
                toggle)
              }
            />
          </Route>

          <Route path="/voicesynthesizer" component={VoiceSynthesizer} />

          {/* <Route path="/voicesynthesizer">
          <VoiceSynthesizer />
        </Route> */}

          {/* <Route path="/login" component={Login} /> */}
          <Route path="/login">
            {/* {loggedIn ? <Redirect to="/" /> : <VirtualAssistant />} */}
            <Login />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <Route path="/dashboard/:username" component={Dashboard} />
          {/* <Route path="/dashboard/:username">
          <Dashboard />
        </Route> */}

          <Route path="/todos">
            <TodoForm />
          </Route>
          {/* 
        <Route  path="/test">
          <Test />
        </Route> */}
        </Switch>
      </SpeechContext.Provider>
    </BrowserRouter>
  );
}

export default App;

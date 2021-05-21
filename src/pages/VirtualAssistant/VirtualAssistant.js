import micOn from "../../assets/images/icons/mic_on.png";
import micOff from "../../assets/images/icons/mic_off.png";
import "./VirtualAssistant.css";
import React, { useEffect, useState, useContext } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import Settings from "../../components/Settings";
import CommandsModal from "../../components/CommandsModal";
import useCommandsModal from "../../hooks/useCommandsModal";
import TodoAPIHelper from "../../helpers/TodoAPIHelper";
import TodoList from "../Todos/TodoForm";

export default function VirtualAssistant() {
  // const SpeechContext = React.createContext();
  const { isShowing, toggle } = useCommandsModal();
  ///////////////////////////////////
  // STATE
  ///////////////////////////////////
  // timer
  const [isActive, setIsActive] = useState(false);
  // todos
  const [showTodos, setShowTodos] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  // conditional settings toggle
  const [showSettings, setShowSettings] = useState(false);
  // Geolocation:
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  // // Weather:
  const [weatherData, setWeatherData] = useState(null);
  // voice synth:
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(null);
  const [message, setMessage] = useState("");
  // GET ALL
  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const todos = await TodoAPIHelper.getAllTodos();
      setTodos(todos);
    };
    fetchTodoAndSetTodos();
  }, []);
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
  // current weather description
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
  // current temperature
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
  // current moon phase
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
    }
  };
  // GET most recently aded task
  const getMostRecentTodo = async () => {
    const lastTodo = await TodoAPIHelper.getMostRecentTodo();
    return lastTodo.data[0];
  };
  // GET oldest task
  const getOldestTodo = async () => {
    const firstTodo = await TodoAPIHelper.getMostRecentTodo();
    return firstTodo.data[firstTodo.data.length - 1];
  };
  // DELETE most recent task
  const deleteMostRecentTodo = async () => {
    const lastTodo = await TodoAPIHelper.getMostRecentTodo();
    const lastTodoId = lastTodo.data[0]._id;
    if (lastTodoId) {
      TodoAPIHelper.deleteTodo(lastTodoId);
    }
  };
  // DELETE oldest task
  const deleteOldestTodo = async () => {
    const lastTodo = await TodoAPIHelper.getMostRecentTodo();
    const firstTodoId = lastTodo.data[lastTodo.data.length - 1]._id;
    if (firstTodoId) {
      TodoAPIHelper.deleteTodo(firstTodoId);
    }
  };
  // CREATE
  const createTodo = async (e) => {
    if (todos.some(({ task }) => task === newTodo)) {
      alert(`Task: ${newTodo} already exists`);
      return;
    }
    // create todo:
    const newTask = await TodoAPIHelper.createTodo(newTodo);
    // add todo to the list:
    setTodos([...todos, newTask]);
  };
  // UPDATE
  const updateTodo = async (e, id) => {
    e.stopPropagation();
    const payload = {
      done: !todos.find((todo) => todo._id === id).done,
    };
    const updatedTodo = await TodoAPIHelper.updateTodo(id, payload);
    setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
  };
  // DELETE
  const deleteTodo = async (e, id) => {
    try {
      e.stopPropagation();
      await TodoAPIHelper.deleteTodo(id);
      setTodos(todos.filter(({ _id: i }) => id !== i));
    } catch (err) {
      console.log(err);
    }
  };
  /////////////////////////////////////////////////////////////////
  // <------------------------- TIME -------------------------> //
  /////////////////////////////////////////////////////////////////
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
    setMessage(time);
    speak({ text: `${time}`, voice, rate, pitch });
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
  /////////////////////////////////////////////////////////////////
  // <----------------------- COMMANDS -----------------------> //
  /////////////////////////////////////////////////////////////////
  const commands = [
    {
      command: ["hello", "hi"],
      callback: () => {
        setMessage("Hello, how can I help you?");
        speak({ text: "Hello, how can I help you?" });
      },
    },
    {
      command: "thank you",
      callback: () => {
        setMessage("You're welcome.");
        speak({ text: "you're welcome" });
      },
    },
    {
      command: ["(hi) my name is *", "(hello) my name is *"],
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
      command: "I'm :hungry",
      callback: (hungry) => {
        setMessage("Hi, hungry, I'm dad.");
        speak({
          text: "Hi hungry, I'm dad.",
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
        setMessage(
          "To view all commands, say 'get commands' or simply 'commands'"
        );
        speak({
          text: "To view all commands, say 'get commands' or simply 'commands'",
        });
      },
    },
    {
      command: ["(get) commands", "show commands"],
      callback: () => {
        setMessage("Opening commands.");
        speak({ text: "Okay.", voice, rate, pitch });
        toggle();
      },
    },
    {
      command: "whisper *",
      callback: (quietWords) => {
        // setWhisper();
        setMessage(`okay, ${quietWords}`);
        speak({ text: `okay, ${quietWords}`, voice: voices[81], rate, pitch });
        setVoiceIndex(voices[81]);
      },
    },
    {
      command: ["log in", "login"],
      callback: () => {
        window.open("../login", "_self");
      },
    },
    {
      command: ["log out", "logout"],
      callback: () => {
        window.open("../login", "_self");
      },
    },
    {
      command: ["register", "sign up", "signup"],
      callback: () => {
        window.open("../register", "_self");
      },
    },
    {
      command: "go to demo",
      callback: () => {
        window.open("../demo", "_self");
      },
    },
    {
      command: "go to test",
      callback: () => {
        window.open("../test", "_self");
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
      command: [
        "up up down down left right left right b a (start)",
        "up up down down left right left right ba (start)",
      ],
      callback: () => {
        setMessage("nerd.");
        speak({ text: "nerd." });
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
        window.open("../voicesynthesizer", "_self");
      },
    },
    {
      command: "show settings",
      callback: () => {
        setMessage("showing settings");
        speak({ text: "okay" });
        setShowSettings(true);
      },
    },
    {
      command: "hide settings",
      callback: () => {
        setMessage("hiding settings");
        speak({ text: "okay" });
        setShowSettings(false);
      },
    },
    //////////////////////////////////////////
    // <--------------- TODOS --------------->
    //////////////////////////////////////////
    {
      command: [
        "show me my to do list",
        "show me my to-do list",
        "show (my) to-do list",
      ],
      callback: () => {
        setShowTodos(true);
        // window.open("../todos", "_self");
      },
    },
    {
      command: ["hide to-do list", "hide to do list", "hide to-dos"],
      callback: () => {
        setShowTodos(false);
      },
    },
    {
      command: [
        "(add) new task *",
        "set new task *",
        "add new to-do *",
        "add new to do *",
      ],
      callback: (task) => {
        setMessage(`add ${task} to to-do list?`);
        speak({
          text: `add ${task} to to-do list?`,
          voice,
          rate,
          pitch,
        });
        const newTodo = task.toString();
        console.log(`task: ${task}`);
        setNewTodo(task.toString());
        console.log(newTodo);
      },
    },
    {
      command: ["yes", "(yes) create to-do", "(yes) add to list"],
      callback: () => {
        setMessage(`creating to-do ${newTodo}.`);
        speak({ text: "okay" });
        createTodo();
      },
    },
    {
      command: [
        "delete most recent task",
        "delete most recent item",
        "delete last added item",
      ],
      callback: () => {
        setMessage("okay");
        speak({ text: "okay" });
        deleteMostRecentTodo();
      },
    },
    {
      command: [
        "delete oldest task",
        "delete oldest item",
        "delete first added item",
      ],
      callback: () => {
        setMessage("okay");
        speak({ text: "okay" });
        deleteOldestTodo();
      },
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
      command: [
        "what is todays date",
        "what's today's date",
        "what's the date",
      ],
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
      command: ["get (the) weather", "fetch weather"],
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
      command: ["what's the temperature", "current temperature"],
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
  ];
  // useSpeechRecog & Synth
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });
  // const onEnd = () => {
  //   // You could do something here after speaking has finished
  // };
  // const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
  //   onEnd,
  // });
  const { speak, voices } = useSpeechSynthesis();
  const voice = voices[1] || null;
  /////////////////////////////////////////////////////////////////
  // <-------------------- EVENT HANDLERS ---------------------> //
  /////////////////////////////////////////////////////////////////
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
  // settings props
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
    // <SpeechContext.Provider value={() => {}}>
    <div className="page" id="VirtualAssistant">
      {/* ///////////////////////////////////////////////////////////////// */}
      {/* <------------------------ COMMANDS MODAL -----------------------> */}
      {/* ///////////////////////////////////////////////////////////////// */}
      {/* <div> */}
      <CommandsModal isShowing={isShowing} hide={toggle} />
      {/* </div> */}

      <div className="center-col virtual-assistant-container">
        <div className="paused virtual-assistant"></div>
      </div>

      <div className="center-col main">
        {showSettings && <Settings {...settingsProps} />}
        {showTodos && <TodoList />}
        {!showSettings && !showTodos && (
          <div>
            <div>
              <div className="instructions-container">
                {/* ///////////////////////////////////////////////////////////////// */}
                {/* <--------------------- INSTRUCTIONS DISPLAY --------------------> */}
                {/* ///////////////////////////////////////////////////////////////// */}

                <div
                  className=" glass-panel"
                  id="instructions"
                  style={{
                    height: "150px",
                    width: "550px",
                    marginBottom: "1px",
                    value: { message },
                  }}
                >
                  <p className="fade-out-text">
                    Hello, I'm a virtual assistant.
                  </p>
                  <p className="fade-out-text">
                    To allow microphone access, press the button below; hold
                    down to talk.
                  </p>
                  {/* <p>To log in say "Log in"</p> */}
                  {/* <p>To make a new account say "Sign up"</p> */}
                  <p className="fade-out-text">
                    To see more commands say "Show commands"
                  </p>
                  <p className="fade-out-text">
                    To add a task to the to-do list, say "Add new task",
                    followed by the task to add; then, say "add to list"
                  </p>
                </div>
              </div>
              {/* <div className="message-display-container"> */}
              {/* ///////////////////////////////////////////////////////////////// */}
              {/* <----------------------- MESSAGE DISPLAY -----------------------> */}
              {/* ///////////////////////////////////////////////////////////////// */}
              {/* <textarea
                  style={{
                    height: "150px",
                    width: "550px",
                    margin: "0px",
                    marginTop: "1px",
                    marginBottom: "0px",
                  }}
                  className="glass-panel"
                  id="messages"
                  placeholder={message}
                  value={message}
                >
                  {message}
                </textarea> */}
              {/* </div> */}
            </div>
            <div className="transcript-display">
              {/* ///////////////////////////////////////////////////////////////// */}
              {/* <-------------------------- TRANSCRIPT -------------------------> */}
              {/* ///////////////////////////////////////////////////////////////// */}
              <textarea
                style={{
                  margin: "0px",
                  marginTop: "0px",
                  height: "150px",
                  width: "550px",
                }}
                className="glass-panel"
                id="transcript"
                // placeholder="transcript"
                value={transcript}
              />{" "}
            </div>
          </div>
        )}
        <div className="form-container">
          <div
            className="center-col buttons"
            style={{ position: "relative", margin: "10px" }}
          >
            <div>
              {/* ///////////////////////////////////////////////////////////////// */}
              {/* <------------------------ HOT MIC "BTN" ------------------------> */}
              {/* ///////////////////////////////////////////////////////////////// */}
              <img className="hot-mic-btn" src={listening ? micOn : micOff} />
            </div>
            {/* ///////////////////////////////////////////////////////////////// */}
            {/* <------------------------- LISTEN BTN --------------------------> */}
            {/* ///////////////////////////////////////////////////////////////// */}
            <button
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className="mic-btn"
            >
              🎤
            </button>
          </div>
        </div>
      </div>
    </div>
    // </SpeechContext.Provider>
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

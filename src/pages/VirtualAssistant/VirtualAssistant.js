import micOn from "../../assets/images/icons/mic_on.png";
import micOff from "../../assets/images/icons/mic_off.png";
import "./VirtualAssistant.css";
import React, { useEffect, useState } from "react";
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
  ///////////////////////////////////
  // TODOS
  ///////////////////////////////////
  const [lastTodo, setLastTodo] = useState("");
  const [firstTodo, setFirstTodo] = useState("");
  const [showTodos, setShowTodos] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  // const [todo, setTodo] = useState("");
  // GET ALL
  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const todos = await TodoAPIHelper.getAllTodos();
      setTodos(todos);
    };
    fetchTodoAndSetTodos();
  }, []);
  // GET most recently aded item
  const getLastAddedTodo = async () => {
    const lastTodo = await TodoAPIHelper.getLastAddedTodo();
    console.log(lastTodo.data[0]);
    return lastTodo.data[0];
  };
  // GET oldest item
  const getFirstAddedTodo = async () => {
    const lastTodo = await TodoAPIHelper.getLastAddedTodo();
    console.log(lastTodo.data[lastTodo.data.length - 1]);
    return lastTodo.data[lastTodo.data.length - 1];
  };
  // DELETE most recent item
  const deleteLastAddedTodo = async () => {
    getFirstAddedTodo();
    // delete it
  };
  // DELETE oldest item
  const deleteFirstAddedTodo = async () => {
    getFirstAddedTodo();
    // delete it
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

  // const addNewTodo = () => {
  //   // const newTask = task.toString();
  //   // setNewTodo(newTask);
  //   if (newTodo) {
  //     createTodo();
  //   } else {
  //     setMessage("no todo added");
  //     speak({ text: "no todo added" });
  //   }
  // };
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

  /////////////////////////////////////////////////////////////////
  // <----------------------- VARIABLES -----------------------> //
  /////////////////////////////////////////////////////////////////
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
    // {
    //   command: "(add) new task *",
    //   callback: (task) => {
    //     setMessage(`${task} added to list`);
    //     speak({ text: `${task} added to list` });
    //     const newTodo = task.toString();
    //     console.log(`task: ${task}`);
    //     setNewTodo(task.toString());
    //     console.log(newTodo);
    //     addNewTodo();
    //   },
    // },
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
        // createTodo();
      },
    },
    {
      command: ["(yes) create to-do", "(yes) add to list"],
      callback: () => {
        setMessage(`creating to-do ${newTodo}.`);
        speak({ text: "okay" });
        createTodo();
      },
    },
    {
      command: "get last added item",
      callback: () => {
        setMessage("okay");
        speak({ text: "okay" });
        getLastAddedTodo();
        // console.log(todos.createdAt[0]);
      },
    },
    {
      command: "get first added item",
      callback: () => {
        setMessage("okay");
        speak({ text: "okay" });
        getFirstAddedTodo();
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

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });
  /////////////////////////////////////////////////////////////////
  // <------------------------- HOOKS -------------------------> //
  /////////////////////////////////////////////////////////////////
  const { isShowing, toggle } = useCommandsModal();

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

  const settingsProps = {
    voiceIndex,
    setVoiceIndex,
    rate,
    setRate,
    pitch,
    setPitch,
    voices,
  };

  /////////////////////////////////////////////////////////////////
  // <------------------------- TODOS -------------------------> //
  /////////////////////////////////////////////////////////////////
  //////////////////////////////
  // Modal
  ///////////////
  // ---
  //////////////////////////////
  // Functions
  ///////////////
  // ---

  return (
    <div className="page" id="VirtualAssistant">
      {/* ///////////////////////////////////////////////////////////////// */}
      {/* <------------------------ COMMANDS MODAL -----------------------> */}
      {/* ///////////////////////////////////////////////////////////////// */}
      <div>
        <CommandsModal isShowing={isShowing} hide={toggle} />
      </div>
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

                <div className="glass-panel" id="instructions">
                  <p>Hello, I'm a virtual assistant.</p>
                  <p>
                    To allow microphone access, press and hold the button below.
                  </p>
                  {/* <p>To log in say "Log in"</p> */}
                  {/* <p>To make a new account say "Sign up"</p> */}
                  <p>To see more commands say "Show commands"</p>
                  <p>
                    To add a task to the to-do list, say "Add new task",
                    followed by the task to add; then, say "add to list"
                  </p>
                </div>
              </div>
              <div className="message-display-container">
                {/* ///////////////////////////////////////////////////////////////// */}
                {/* <----------------------- MESSAGE DISPLAY -----------------------> */}
                {/* ///////////////////////////////////////////////////////////////// */}
                <textarea
                  className="glass-panel"
                  id="messages"
                  placeholder={message}
                >
                  {message}
                </textarea>
              </div>
            </div>
            <div className="transcript-display">
              {/* ///////////////////////////////////////////////////////////////// */}
              {/* <-------------------------- TRANSCRIPT -------------------------> */}
              {/* ///////////////////////////////////////////////////////////////// */}
              <textarea
                className="glass-panel"
                id="transcript"
                value={transcript}
              />{" "}
            </div>
          </div>
        )}
        {/* <div> */}
        <div className="form-container">
          <div
            className="center-col buttons"
            style={{ position: "relative", margin: "10px" }}
          >
            <div>
              {/* ///////////////////////////////////////////////////////////////// */}
              {/* <----------------------- HOT MIC "BTN" -----------------------> */}
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

        {/* </div> */}
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

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
  /////////////////////////////////////////////////////////////////
  // <------------------------- STATE -------------------------> //
  /////////////////////////////////////////////////////////////////
  // commands(direct) : toggle show settings
  const [showSettings, setShowSettings] = useState(false);
  // commands(direct) : sec/min timers
  const [isActive, setIsActive] = useState(false);
  // commands(direct) : toggle show todo list
  const [showTodos, setShowTodos] = useState(false);
  // todos fetches(from APIHelper)
  const [todos, setTodos] = useState([]);
  // todos fetches & commands(direct)
  const [newTodo, setNewTodo] = useState("");
  // Geolocation(weather):
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  // // Weather:
  const [weatherData, setWeatherData] = useState(null);
  // bored
  const [boredomActivity, setBoredomActivity] = useState(null);
  // voice synth:
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(null);
  const [message, setMessage] = useState("");
  /////////////////////////////////////////////////////////////////
  // <------------------------- TODOS -------------------------> //
  /////////////////////////////////////////////////////////////////
  // GET ALL
  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const todos = await TodoAPIHelper.getAllTodos();
      setTodos(todos);
    };
    fetchTodoAndSetTodos();
  }, []);
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
  // <------------------------ Weather ------------------------> //
  /////////////////////////////////////////////////////////////////
  // Geolocation:
  useEffect(() => {
    const getLocation = async () => {
      await navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
    };
    getLocation();
  }, []);
  // fetch weather:
  const fetchWeather = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_WEATHER_API_URL}/onecall?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=imperial`
    );
    const weather = await res.json();
    setWeatherData(weather);
    console.log(weatherData);
    return weather;
  };
  // get current weather description:
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
  // get current temp:
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
  // get current clouds:
  const getCurrentClouds = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.current.clouds.toString()} %`;
      speak({ text: weatherText });
      setMessage(weatherText);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.current.clouds.toString()} %`;
        speak({ text: weatherText });
      }
    }
  };
  // get current humidity:
  const getCurrentHumidity = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.current.humidity.toString()} %`;
      speak({ text: weatherText });
      setMessage(weatherText);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.current.humidity.toString()} %`;
        speak({ text: weatherText });
      }
    }
  };
  // get current moon phase
  const getMoonPhase = async () => {
    if (weatherData) {
      const phase = weatherData.daily[0].moon_phase;
      let currentPhase = "new moon";
      if (phase === 0.25) {
        currentPhase = "first quarter";
      } else if (phase === 0.5) {
        currentPhase = "full moon";
      } else if (phase === 0.75) {
        currentPhase = "last quarter";
      } else if (phase === 1 || phase === 0) {
        currentPhase = "new moon";
      } else if (phase > 0.75 && phase < 1) {
        currentPhase = "waning crescent";
      } else if (phase > 0.5 && phase < 0.75) {
        currentPhase = "waning gibous";
      } else if (phase > 0.25 && phase < 0.5) {
        currentPhase = "waxing gibous";
      } else if (phase > 0 && phase < 0.25) {
        currentPhase = "waxing crescent";
      }
      const weatherText = `${currentPhase}`;
      speak({ text: weatherText });
      setMessage(weatherText);
      console.log("phase: ", weatherData.daily[0].moon_phase.toString());
    } else {
      speak({ text: "cannot fetch data" });
    }
  };
  // get sunrise time:
  const getSunrise = async () => {
    if (weatherData) {
      const utc = `${weatherData.daily[0].sunrise}`;
      const date = new Date(utc * 1000);
      const timeString = date.toLocaleTimeString();
      const weatherText = timeString.split(":").join();
      speak({ text: weatherText });
      setMessage(timeString);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.daily[0].sunrise}`;
        speak({ text: weatherText });
      }
    }
  };
  // get sunset time:
  const getSunset = async () => {
    if (weatherData) {
      const utc = `${weatherData.daily[0].sunset}`;
      const date = new Date(utc * 1000);
      const timeString = date.toLocaleTimeString();
      const weatherText = timeString.split(":").join();
      speak({ text: weatherText });
      setMessage(timeString);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.daily[0].sunset}`;
        speak({ text: weatherText });
      }
    }
  };
  // get moonrise time:
  const getMoonrise = async () => {
    if (weatherData) {
      const utc = `${weatherData.daily[0].moonrise}`;
      const date = new Date(utc * 1000);
      const timeString = date.toLocaleTimeString();
      const weatherText = timeString.split(":").join();
      speak({ text: weatherText });
      setMessage(timeString);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.daily[0].moonrise}`;
        speak({ text: weatherText });
      }
    }
  };
  // get moonset time:
  const getMoonset = async () => {
    if (weatherData) {
      const utc = `${weatherData.daily[0].moonset}`;
      const date = new Date(utc * 1000);
      const timeString = date.toLocaleTimeString();
      const weatherText = timeString.split(":").join();
      speak({ text: weatherText });
      setMessage(timeString);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.daily[0].moonset}`;
        speak({ text: weatherText });
      }
    }
  };
  // get forecast:
  const getForecast = async () => {
    if (weatherData) {
      const monday = `${weatherData.daily[0].weather[0].description}`;
      const tuesday = `${weatherData.daily[1].weather[0].description}`;
      const wednesday = `${weatherData.daily[2].weather[0].description}`;
      const thursday = `${weatherData.daily[3].weather[0].description}`;
      const friday = `${weatherData.daily[4].weather[0].description}`;
      const saturday = `${weatherData.daily[5].weather[0].description}`;
      const sunday = `${weatherData.daily[6].weather[0].description}`;

      speak({
        text: `Monday: ${monday}, Tuesday: ${tuesday}, Wednesday: ${wednesday}, Thursday: ${thursday}, Friday: ${friday}, Saturday: ${saturday}, and Sunday: ${sunday}`,
      });
      setMessage(
        `Monday: ${monday}, Tuesday: ${tuesday}, Wednesday: ${wednesday}, Thursday: ${thursday}, Friday: ${friday}, Saturday: ${saturday}, and Sunday: ${sunday}`
      );
    }
  };
  // get short forecast:
  const getShortForecast = async () => {
    if (weatherData) {
      const monday = `${weatherData.daily[0].weather[0].main}`;
      const tuesday = `${weatherData.daily[1].weather[0].main}`;
      const wednesday = `${weatherData.daily[2].weather[0].main}`;
      const thursday = `${weatherData.daily[3].weather[0].main}`;
      const friday = `${weatherData.daily[4].weather[0].main}`;
      const saturday = `${weatherData.daily[5].weather[0].main}`;
      const sunday = `${weatherData.daily[6].weather[0].main}`;

      speak({
        text: `Monday: ${monday}, Tuesday: ${tuesday}, Wednesday: ${wednesday}, Thursday: ${thursday}, Friday: ${friday}, Saturday: ${saturday}, and Sunday: ${sunday}`,
      });
      setMessage(
        `Monday: ${monday}, Tuesday: ${tuesday}, Wednesday: ${wednesday}, Thursday: ${thursday}, Friday: ${friday}, Saturday: ${saturday}, and Sunday: ${sunday}`
      );
    }
  };
  // get the high temp:
  const getHigh = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.daily[0].temp.max}`;

      speak({
        text: `${weatherText} degrees`,
      });
      setMessage(`${weatherText} degrees`);
    }
  };
  // get the chance of rain:
  const getRainChance = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.daily[0].pop}`;

      speak({
        text: `${weatherText} %`,
      });
      setMessage(`${weatherText} %`);
    }
  };
  /////////////////////////////////////////////////////////////////
  // <------------------------- Other -------------------------> //
  /////////////////////////////////////////////////////////////////
  // bored:
  const getBored = async () => {
    const res = await fetch("http://www.boredapi.com/api/activity/");
    const activity = await res.json();
    setBoredomActivity(activity);
    console.log(boredomActivity);
    return activity;
  };

  // // get current weather description:
  // const getCurrentWeatherDescription = async () => {
  //   if (weatherData) {
  //     const weatherText = `${weatherData.current.weather[0].description}`;
  //     speak({ text: weatherText });
  //     setMessage(weatherText);
  //   } else {
  //     const weather = await fetchWeather();
  //     if (weather) {
  //       const weatherText = `${weather.current.weather[0].description}`;
  //       speak({ text: weatherText });
  //     }
  //   }
  // };
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
    // <--------------- TODOS --------------->
    {
      command: [
        "show me my to do list",
        "show me my to-do list",
        "show (my) to-do list",
      ],
      callback: () => {
        setShowTodos(true);
      },
    },
    {
      command: ["hide to-do list", "hide to do list", "hide to-dos"],
      callback: () => {
        setShowTodos(false);
      },
    },
    // {
    //   command: "add :task to to-do list",
    //   callback: (task) => {
    //     setMessage(`add ${task} to to-do list?`);
    //     speak({
    //       text: `add ${task} to to-do list?`,
    //       voice,
    //       rate,
    //       pitch,
    //     });
    //     const newTodo = task.toString();
    //     console.log(`task: ${task}`);
    //     setNewTodo(task.toString());
    //     console.log(newTodo);
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
          text: `add ${task} to to do list?`,
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
    // <--------------- TIME --------------->
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
    // <-------------- WEATHER -------------->
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
      command: ["what's the high (today)", "what's the high (for today)"],
      callback: () => {
        getHigh();
      },
    },
    {
      command: "how cloudy is it (today)",
      callback: () => {
        getCurrentClouds();
      },
    },
    {
      command: "what's the chance of rain",
      callback: () => {
        getRainChance();
      },
    },
    {
      command: "how humid is it (today)",
      callback: () => {
        getCurrentHumidity();
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
    {
      command: ["what time is sunrise", "when is sunrise"],
      callback: () => {
        getSunrise();
      },
    },
    {
      command: ["what time is sunset", "when is sunset"],
      callback: () => {
        getSunset();
      },
    },
    {
      command: [
        "what time is moonrise",
        "when does the moonrise",
        "what time does the moon rise",
      ],
      callback: () => {
        getMoonrise();
      },
    },
    {
      command: [
        "what time is moonset",
        "when does the moonset",
        "what time does the moon set",
      ],
      callback: () => {
        getMoonset();
      },
    },
    {
      command: [
        "what's the forecast (this week)",
        "what's the forecast (for the week)",
      ],
      callback: () => {
        getForecast();
      },
    },
    {
      command: [
        "what's the quick forecast (this week)",
        "what's the fast forecast (for the week)",
      ],
      callback: () => {
        getShortForecast();
      },
    },
    {
      command: "I'm bored",
      callback: () => {
        getBored();
      },
    },
  ];
  /////////////////////////////////////////////////////////////////
  // <------------------------- HOOKS -------------------------> //
  /////////////////////////////////////////////////////////////////
  // speech synth:
  const onEnd = () => {
    // You could do something here after speaking has finished
  };
  const { speak, /*cancel, speaking, supported,*/ voices } = useSpeechSynthesis(
    {
      onEnd,
    }
  );
  const voice = voices[1] || null;
  // speech recog:
  const {
    transcript,
    // interimTranscript,
    // finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });
  // toggle show commands modal:
  const { isShowing, toggle } = useCommandsModal();
  /////////////////////////////////////////////////////////////////
  // <-------------------- EVENT HANDLERS ---------------------> //
  /////////////////////////////////////////////////////////////////
  // start animation/start listening:
  const handleMouseDown = async (e) => {
    e.preventDefault();
    const VirtualAss = document.getElementsByClassName("virtual-assistant");
    VirtualAss[0].classList.remove("paused");

    await SpeechRecognition.startListening({
      continuous: false,
      language: "en-US",
    });
  };
  // pause VA animation/stop listening:
  const handleMouseUp = async (e) => {
    e.preventDefault();

    const VirtualAss = document.getElementsByClassName("virtual-assistant");
    VirtualAss[0].classList.add("paused");

    await SpeechRecognition.stopListening();
  };
  // PROPS:
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
                {/* <----------------- INSTRUCTIONS/MESSAGE DISPLAY ----------------> */}
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
                  {message}

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

import React, { useEffect, useState } from "react";
// import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import Settings from "../../components/Settings";
import CommandsModal from "../../components/CommandsModal";
import useCommandsModal from "../../hooks/useCommandsModal";
import TodoAPIHelper from "../../helpers/TodoAPIHelper";
import TodoList from "../Todos/TodoForm";
import micOn from "../../assets/images/icons/mic_on.png";
import micOff from "../../assets/images/icons/mic_off.png";
import useSound from "use-sound";
import hilo_sparkle from "../../assets/sounds/testing/hilo_sparkle.mp3";
import Bells10 from "../../assets/sounds/testing/Bells10.mp3";
import Bells11 from "../../assets/sounds/testing/Bells11.mp3";
import LoadingTone from "../../assets/sounds/testing/Mech-Drone-12.mp3";
import PowerDown7 from "../../assets/sounds/testing/PowerDown7.mp3";
import PowerUp18 from "../../assets/sounds/testing/PowerUp18.mp3";
import SynthChime8 from "../../assets/sounds/testing/SynthChime8.mp3";
import SynthChime9 from "../../assets/sounds/testing/SynthChime9.mp3";
import SynthChime11 from "../../assets/sounds/testing/SynthChime11.mp3";
import Quirky7 from "../../assets/sounds/testing/UI_Quirky7.mp3";
import Quirky8 from "../../assets/sounds/testing/UI_Quirky8.mp3";
import "./VirtualAssistant.css";

/* DEEPL ENDPOINT EX
// https://api-free.deepl.com/v2/translate?auth_key=26b78442-234b-ac27-1823-37eb1d698edc%3Afx&text=&target_lang=de
*/

export default function VirtualAssistant() {
  /////////////////////////////////////////////////////////////////
  // <------------------------- STATE -------------------------> //
  /////////////////////////////////////////////////////////////////
  // err msg:
  const [errorMessage, setErrorMessage] = useState("");
  // deepl secret key:
  const deeplApiKey = process.env.REACT_APP_DEEPL_KEY;
  // Translation POST data:
  const [langCode, setLangCode] = useState("");
  const [translations, setTranslations] = useState(null);
  // Translation GET data:
  const [langs, setLangs] = useState([]);
  // Settings:
  const [showSettings, setShowSettings] = useState(false);
  // Todos:
  const [showTodos, setShowTodos] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  // Geolocation(weather):
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  // Weather:
  const [weatherData, setWeatherData] = useState(null);
  // Voice:
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(2);
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
    setTimeout(function (countdown) {
      let counter = 0;
      while (countdown > 0) {
        countdown--;
      }
      setMessage("beep.");
      speak({ text: "beep.", voice: voices[voiceIndex], rate, pitch });
      return;
    }, countdown);
  };
  // Minutes timer:
  const setMinutesTimer = (timeout) => {
    const countdown = parseInt(timeout) * 60000;
    setTimeout(function (countdown) {
      while (countdown > 0) {
        countdown--;
      }
      setMessage("beep.");
      speak({ text: "beep.", voice: voices[voiceIndex], rate, pitch });
      return;
    }, countdown);
  };
  // current time:
  const fetchTime = () => {
    const today = new Date();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    setMessage(time);
    speak({ text: `${time}`, voice: voices[voiceIndex], rate, pitch });
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
    speak({
      text: `the date is ${date}`,
      voice: voices[voiceIndex],
      rate,
      pitch,
    });
  };
  // current day:
  const fetchDay = () => {
    // Get the day of week, from 0 (Sunday) to 6 (Saturday).
    const today = new Date();
    const day = today.getDay();
    if (day === 0) {
      setMessage("Today is Sunday.");
      speak({ text: "sunday", voice: voices[voiceIndex], rate, pitch });
    } else if (day === 1) {
      setMessage("Today is Monday.");
      speak({ text: "monday", voice: voices[voiceIndex], rate, pitch });
    } else if (day === 2) {
      setMessage("Today is Tuesday.");
      speak({ text: "tuesday", voice: voices[voiceIndex], rate, pitch });
    } else if (day === 3) {
      setMessage("Today is Wednesday.");
      speak({ text: "wednesday", voice: voices[voiceIndex], rate, pitch });
    } else if (day === 4) {
      setMessage("Today is Thursday.");
      speak({ text: "thursday", voice: voices[voiceIndex], rate, pitch });
    } else if (day === 5) {
      setMessage("Today is Friday.");
      speak({ text: "friday", voice: voices[voiceIndex], rate, pitch });
    } else if (day === 6) {
      setMessage("Today is Saturday.");
      speak({ text: "saturday", voice: voices[voiceIndex], rate, pitch });
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
    // console.log(weatherData);
    return weather;
  };
  // get current weather description:
  const getCurrentWeatherDescription = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.current.weather[0].description}`;
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(weatherText);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.current.weather[0].description}`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
      }
    }
  };
  // get current temp:
  const getCurrentTemperature = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.current.temp.toString()} degrees`;
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(weatherText);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.current.temp.toString()} degrees`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
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
        speak({ text: weatherText, voice: voices[voiceIndex] });
      }
    }
  };
  // get current humidity:
  const getCurrentHumidity = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.current.humidity.toString()} %`;
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(weatherText);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.current.humidity.toString()} %`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
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
        currentPhase = "full moon - that explains my mood.";
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
      // speak({ text: weatherText, voice: voices[voiceIndex], });
      speak({ text: weatherText, voice: voices[voiceIndex], rate, pitch });
      setMessage(weatherText);
      // console.log("phase: ", weatherData.daily[0].moon_phase.toString());
    } else {
      speak({ text: "cannot fetch data", voice: voices[voiceIndex] });
    }
  };
  // get sunrise time:
  const getSunrise = async () => {
    if (weatherData) {
      const utc = `${weatherData.daily[0].sunrise}`;
      const date = new Date(utc * 1000);
      const timeString = date.toLocaleTimeString();
      const weatherText = timeString.split(":").join();
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(timeString);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.daily[0].sunrise}`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
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
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(timeString);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.daily[0].sunset}`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
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
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(timeString);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.daily[0].moonrise}`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
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
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(timeString);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.daily[0].moonset}`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
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
        voice: voices[voiceIndex],
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
        voice: voices[voiceIndex],
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
        voice: voices[voiceIndex],
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
        voice: voices[voiceIndex],
      });
      setMessage(`${weatherText} %`);
    }
  };
  //////////////////////////////////////////////////////////////
  // <------------------------ Math ------------------------> //
  //////////////////////////////////////////////////////////////
  // Addition(2 nums):
  const add = (a, b) => {
    const c = parseInt(a) + parseInt(b);
    const ans = c.toString();
    setMessage(`${ans}`);
    speak({ text: `${ans}`, voice: voices[voiceIndex] });
    return ans;
  };
  // Subtraction(2 nums):
  const subtract = (a, b) => {
    const c = parseInt(a) - parseInt(b);
    const ans = c.toString();
    setMessage(`${ans}`);
    speak({ text: `${ans}`, voice: voices[voiceIndex] });
    return ans;
  };
  // Multiply(2 nums):
  const multiply = (a, b) => {
    const c = parseInt(a) * parseInt(b);
    const ans = c.toString();
    setMessage(`${ans}`);
    speak({ text: `${ans}`, voice: voices[voiceIndex] });
    return ans;
  };
  // Divide(2 nums):
  const divide = (a, b) => {
    const c = parseInt(a) / parseInt(b);
    const ans = c.toString();
    setMessage(`${ans}`);
    speak({ text: `${ans}`, voice: voices[voiceIndex] });
    return ans;
  };
  // Remainder:
  const remainder = (a, b) => {
    const c = parseInt(a) % parseInt(b);
    const ans = c.toString();
    setMessage(`${ans}`);
    speak({ text: `${ans}`, voice: voices[voiceIndex] });
    return ans;
  };
  const setWhisper = () => {
    setVoiceIndex(81);
    setMessage("ok i'll whisper");
    speak({ text: "ok I'll be quiet.", voice: voices[81] });
  };
  /////////////////////////////////////////////////////////////////
  // <----------------------- TRANSLATOR ----------------------> //
  /////////////////////////////////////////////////////////////////
  // Check API usage:
  const getUsage = async () => {
    const data = await fetch(
      "https://api-free.deepl.com/v2/usage?auth_key=26b78442-234b-ac27-1823-37eb1d698edc:fx"
    ).then((data) => data.json());
    console.log("usage data: ", data);
    if (data) {
      const charCount = `Your character count is at ${data.character_count.toString()} and your character limit is at ${data.character_limit.toString()}`;
      speak({
        text: charCount,
        voice: voices[voiceIndex],
      });
      setMessage(
        `Your character count is at ${data.character_count.toString()} and your character limit is at ${data.character_limit.toString()}`
      );
    } else {
      speak({
        text: "I'm sorry, I can't fetch that right now.",
        voice: voices[voiceIndex],
      });
      setMessage("I'm sorry, I can't fetch that right now.");
    }
  };
  // Fetch Languages:
  const getLanguages = async () => {
    const data = await fetch(
      "https://api-free.deepl.com/v2/languages?auth_key=26b78442-234b-ac27-1823-37eb1d698edc:fx"
    ).then((data) => data.json());
    setLangs([...data]);
    if (data) {
      return langs.data;
    } else {
      speak({
        text: "I'm sorry, I can't fetch that data right now.",
        voice: voices[voiceIndex],
      });
      setMessage("I'm sorry, I can't fetch that data right now.");
    }
  };
  // // Translate:
  // const translate = async (text) => {
  //   const translationText = text.split(" ").join("%20");
  //   try {
  //     const res = await fetch(
  //       `http://api-free.deepl.com/v2/translate?auth_key=26b78442-234b-ac27-1823-37eb1d698edc:fx&text=${translationText}&target_lang=es&source_lang=en`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },
  //         body: JSON.stringify(translationText),
  //       }
  //     );
  //     await data
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   if (data) {
  //     setTranslation(data);
  //     console.log("translation obj: ", data.translation[0]);
  //     console.log("translation: arr: ", data.translation);
  //   }
  // };
  /////////////////////////////////////////////////////////////////
  // <--------------------- AUDIO EARCONS ---------------------> //
  /////////////////////////////////////////////////////////////////
  // Bells10:
  const [playBells10] = useSound(Bells10);
  const handlePlayBells10 = () => {
    playBells10();
  };
  // Bells11:
  const [playBells11] = useSound(Bells11);
  const handlePlayBells11 = () => {
    playBells11();
  };
  // Testing loop audio(LoadingTone):
  const [loop, setLoop] = useState(false);
  // const [playLoadingTone, { sound }] = useSound(LoadingTone);
  const [playLoadingTone, { sound, stop }] = useSound(LoadingTone, {
    loop,
  });
  const handlePlayLoadingTone = () => {
    playLoadingTone();
    // // Can loop - canNOT end loop...
    // const soundLoop = sound.loop(true);
    // setLoop(soundLoop);
    // sound.loop(true);
  };
  // const handleStopLoadingTone = () => {
  //   playLoadingTone();
  //   // Can loop - canNOT end loop...
  //   const soundLoop = sound.loop(false);
  //   setLoop(soundLoop);
  // };
  // Testing onstop (PowerDown7):
  const [playPowerDown7] = useSound(PowerDown7, {
    onstop: () => {
      console.log("Audio has stopped.");
    },
  });
  const handlePlayPowerDown7 = () => {
    playPowerDown7();
  };
  // PowerUp18:
  const [playPowerUp18] = useSound(PowerUp18);
  const handlePlayPowerUp18 = () => {
    playPowerUp18();
  };
  // SynthChime8:
  const [playSynthChime8] = useSound(SynthChime8);
  const handlePlaySynthChime8 = () => {
    playSynthChime8();
  };
  // SynthChime9:
  const [playSynthChime9] = useSound(SynthChime9);
  const handlePlaySynthChime9 = () => {
    playSynthChime9();
  };
  // Test speech onend of audio(SynthChime11):
  const [playSynthChime11] = useSound(SynthChime11, {
    onend: () => {
      speak({
        text: "testing speech after audio",
        voice: voices[voiceIndex],
      });
      console.info("Sound has ended");
    },
  });
  const handlePlaySynthChime11 = () => {
    playSynthChime11();
  };
  // Quirky7:
  const [playQuirky7] = useSound(Quirky7);
  const handlePlayQuirky7 = () => {
    playQuirky7();
  };
  // Quirky8:
  const [playQuirky8] = useSound(Quirky8);
  const handlePlayQuirky8 = () => {
    playQuirky8();
  };

  // Test:
  const [playSparkle] = useSound(hilo_sparkle);
  const handlePlayAudio = () => {
    playSparkle();
    // console.log("playing hilo_sparkle");
    // console.log("hilo_sparkle: ", hilo_sparkle);
  };
  const onEnd = () => {
    // Do something here after speaking has finished:
    setMessage("audio testing...");
    console.log("speaking : ", window.speechSynthesis.speaking);
    console.log("msg: ", message);
  };
  const handlePlayAudioAndThenSpeak = () => {
    playSynthChime11();
    console.log();
  };

  /////////////////////////////////////////////////////////////////
  // <----------------------- COMMANDS -----------------------> //
  /////////////////////////////////////////////////////////////////
  const commands = [
    {
      command: "play audio bells",
      callback: () => {
        handlePlayBells10();
        console.log("Playing: Bells10");
      },
    },
    {
      command: ["play audio for search", "play audio for searching"],
      callback: () => {
        handlePlayBells11();
        console.log("Playing: Bells11");
      },
    },
    {
      command: ["play audio for load", "play audio for loading"],
      callback: () => {
        handlePlayLoadingTone();
        // const soundLoop = sound.loop(true);
        // setLoop(soundLoop);
        console.log("Playing: LoadingTone");
        // console.log("Looping: LoadingTone");
      },
    },
    // {
    //   command: [
    //     "end audio for load",
    //     "end audio for loading",
    //     "stop audio for load",
    //     "stop audio for loading",
    //   ],
    //   callback: () => {
    //     handleStopLoadingTone();
    //     const soundLoop = sound.loop(false);
    //     setLoop(soundLoop);
    //     console.log("Ending loop: LoadingTone");
    //     // console.log("Looping: LoadingTone");
    //   },
    // },
    {
      command: ["play audio for ended listening"],
      callback: () => {
        handlePlayPowerDown7();
        console.log("Playing: PowerDown7");
      },
    },
    {
      command: ["play audio for success"],
      callback: () => {
        handlePlayPowerUp18();
        console.log("Playing: PowerUp18");
      },
    },
    {
      command: ["play audio for listening"],
      callback: () => {
        handlePlaySynthChime8();
        console.log("Playing: SynthChime8");
      },
    },
    {
      command: ["play audio chime"],
      callback: () => {
        handlePlaySynthChime9();
        console.log("Playing: SynthChime9");
      },
    },
    {
      command: ["play audio chime 11"],
      callback: () => {
        handlePlaySynthChime11();
        console.log("Playing: SynthChime11");
      },
    },
    {
      command: [
        "play audio click seven",
        "play audio click 7",
        "play low high",
      ],
      callback: () => {
        handlePlayQuirky7();
        console.log("Playing: Quirky7");
      },
    },
    {
      command: [
        "play audio click eight",
        "play audio click 8",
        "play high low",
      ],
      callback: () => {
        handlePlayQuirky8();
        console.log("Playing: Quirky8");
      },
    },
    {
      command: ["test sound", "test audio", "play sound", "play audio"],
      callback: () => {
        setMessage("audio testing...");
        console.log("msg: ", message);
        handlePlayAudio();
      },
    },
    {
      command: [
        "test sound and then speak",
        "test audio and then speak",
        "play sound and then speak",
        "play audio and then speak",
      ],
      callback: () => {
        onEnd();
        handlePlayAudioAndThenSpeak();
        console.log("onEnd => speaking : ", window.speechSynthesis.speaking);
      },
    },
    {
      command: [
        "test sound and speak",
        "test audio and speak",
        "play sound and speak",
        "play audio and speak",
      ],
      callback: () => {
        speak({
          text: "testing speech during audio",
          voice: voices[voiceIndex],
        });
        onEnd();
        handlePlayAudio();
        console.log(
          "speechSynthesis.onEnd => speaking : ",
          window.speechSynthesis.speaking
        );
      },
    },
    {
      command: ["hello", "hi"],
      callback: () => {
        setMessage("Hello, how can I help you?");
        speak({
          text: "Hello, how can I help you?",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: ["how are you (today)", "how are you doing"],
      callback: () => {
        setMessage(
          "Something snarky but not really its just that I don't feel"
        );
        speak({
          text: "Something snarky but not really its just that I don't feel",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: "What's your name",
      callback: () => {
        setMessage("My name is Iris.");
        speak({
          text: "My name is Iris.",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: ["thank you", "thanks"],
      callback: () => {
        setMessage("You're welcome.");
        speak({ text: "you're welcome", voice: voices[voiceIndex] });
      },
    },
    {
      command: "speak",
      callback: () => {
        setMessage("woof.");
        speak({ text: "woof", voice: voices[voiceIndex] });
      },
    },
    {
      command: ["respond", "say something"],
      callback: () => {
        setMessage("");
        speak({
          text: "I am the darkness. I will devour you.",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: ["shush", "stop talking"],
      callback: () => {
        setMessage("ok");
        speak({ text: "ok", voice: voices[81] });
      },
    },
    {
      command: ["(hi) my name is *", "(hello) my name is *"],
      callback: (name) => {
        setMessage(`Hello, ${name}! I hope to remember that in the future.`);
        speak({
          text: `Hello, ${name}! I hope to remember that in the future.`,
          voice: voices[voiceIndex],
          rate,
          pitch,
        });
      },
    },
    {
      command: "How do you pronounce *",
      callback: (word) => {
        speak({
          text: `${word} - Should I repeat that?`,
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: "I'm :hungry",
      callback: (hungry) => {
        setMessage(`Hi, ${hungry}, I'm dad.`);
        speak({
          text: `Hi, ${hungry}, I'm dad.`,
          voice: voices[voiceIndex],
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
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: ["(get) commands", "show commands"],
      callback: () => {
        setMessage("Opening commands.");
        speak({ text: "Okay.", voice: voices[voiceIndex], rate, pitch });
        toggle();
      },
    },
    {
      command: "whisper",
      callback: () => {
        setWhisper();
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
        speak({ text: "nerd.", voice: voices[voiceIndex] });
      },
    },
    {
      command: "google search exact *",
      callback: (exactTerm) => {
        window.open(`http://www.google.com/search?q="${exactTerm}`);
      },
    },
    {
      command: ["go to voice synthesizer", "show voice synthesizer"],
      callback: () => {
        window.open("../voicesynthesizer", "_self");
      },
    },
    {
      command: "show settings",
      callback: () => {
        setMessage("showing settings");
        speak({ text: "okay", voice: voices[voiceIndex] });
        setShowSettings(true);
      },
    },
    {
      command: "hide settings",
      callback: () => {
        setMessage("hiding settings");
        speak({ text: "okay", voice: voices[voiceIndex] });
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
    {
      command: [
        "(add) new task * (to to-do list)",
        "set new task * (on to-do list)",
        "add new to-do * (to to-do list)",
        "add new to do * (to to-do list)",
      ],
      callback: (task) => {
        setMessage(`add ${task} to to-do list?`);
        speak({
          text: `add ${task} to to do list?`,
          voice: voices[voiceIndex],
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
        speak({ text: "okay", voice: voices[voiceIndex] });
        createTodo();
      },
    },
    {
      command: [
        "delete most recent task (from to-do list)",
        "delete most recent item (from to-do list)",
        "delete last added item (from to-do list)",
        "delete latest task (from to-do list)",
        "remove last added task (from to-do list)",
        "remove most recent task (from to-do list)",
      ],
      callback: () => {
        setMessage("okay");
        speak({ text: "okay", voice: voices[voiceIndex] });
        deleteMostRecentTodo();
      },
    },
    {
      command: [
        "delete oldest task (from to-do list)",
        "delete oldest item (from to-do list)",
        "delete first added item (from to-do list)",
        "remove first (added) task (from to-do list)",
        "remove oldest task (from to-do list)",
      ],
      callback: () => {
        setMessage("okay");
        speak({ text: "okay", voice: voices[voiceIndex] });
        deleteOldestTodo();
      },
    },
    // <--------------- TIME --------------->
    {
      command: "set (a) timer for :timeout seconds",
      callback: (timeout) => {
        // setIsActive(true);
        setSecondsTimer(timeout);
        setMessage(`Timer set for ${timeout} seconds`);
        speak({
          text: `Timer set for ${timeout} seconds`,
          voice: voices[voiceIndex],
          rate,
          pitch,
        });
      },
    },
    {
      command: [
        "set (a) timer for :timeout minutes",
        "set a timer for :timeout minute",
      ],
      callback: (timeout) => {
        // setIsActive(true);
        setMinutesTimer(timeout);
        setMessage(`Timer set for ${timeout} minutes`);
        speak({
          text: `Timer set for ${timeout} minutes`,
          voice: voices[voiceIndex],
          rate,
          pitch,
        });
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
        // handlePlayLoadingTone();
        fetchWeather();
        setMessage("weather fetched");
        console.log(message);
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
      command: "The weather is :condition today",
      callback: (condition) => setMessage(`Today, the weather is ${condition}`),
    },
    {
      command: "My top sports are * and *",
      callback: (sport1, sport2) => setMessage(`#1: ${sport1}, #2: ${sport2}`),
    },
    // <--------------- MATH --------------->
    {
      command: [
        "add together * and *",
        "what is * plus *",
        "how much is * plus *",
        "what's the total of * and *",
        "what's the sum of * and *",
      ],
      callback: (a, b) => {
        add(a, b);
      },
    },
    {
      command: [
        "what is * minus *",
        "what's * minus *",
        "how much is * minus *",
      ],
      callback: (a, b) => {
        subtract(a, b);
      },
    },
    {
      command: [
        "multiply * and *",
        "what is * times *",
        "what's * times *",
        "how much is * times *",
      ],
      callback: (a, b) => {
        multiply(a, b);
      },
    },
    {
      command: [
        "divide * into *",
        "what is * divided by *",
        "what's * divided by *",
        "how much is * divided by *",
        "how much is * over *",
      ],
      callback: (a, b) => {
        divide(a, b);
      },
    },
    {
      command: [
        "what is the remainder of * divided by *",
        "what's the remainder of * divided by *",
        "how much is left when * is divided by *",
        "how much is left over when * is divided by *",
      ],
      callback: (a, b) => {
        remainder(a, b);
      },
    },
    {
      command: "Beijing",
      callback: (command, spokenPhrase, similarityRatio) =>
        setMessage(
          `${command} and ${spokenPhrase} are ${similarityRatio * 100}% similar`
        ),
      // If the spokenPhrase is "Benji", the message would be "Beijing and Benji are 40% similar"
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
    },
    {
      command: ["eat", "sleep", "leave"],
      callback: (command) => setMessage(`Best matching command: ${command}`),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true,
    },
    // <--------------- LANGUAGE --------------->
    {
      command: "hola",
      callback: () => {
        SpeechRecognition.startListening({ language: "es-MX" });
        setVoiceIndex(64);
        setMessage("¡Hola, Buenos días!");
        speak({
          text: "¡Hola, Buenos días!",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: ["buenos dias", "como estas"],
      callback: () => {
        setMessage("");
        speak({
          text: "",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: "adios",
      callback: () => {
        SpeechRecognition.startListening({ language: "en-BG" });
        setVoiceIndex(2);
        setMessage("Adiós!");
        speak({ text: "Adios!", voice: voices[voiceIndex] });
      },
    },
    {
      command: "what does my translator usage look like",
      callback: () => {
        getUsage();
      },
    },
    {
      command: [
        "what languages can you speak",
        "what languages do you speak",
        "how many languages do you speak",
      ],
      callback: () => {
        getLanguages();
        if (langs) {
          speak({
            text: `I can speak nine languages. ${langs[3].name}, ${langs[5].name}, ${langs[6].name}, ${langs[9].name}, ${langs[11].name}, ${langs[12].name}, ${langs[17].name}, ${langs[19].name}, and ${langs[23].name}, `,
            voice: voices[voiceIndex],
          });
          setMessage(
            `I can speak nine languages - ${langs[3].name}, ${langs[5].name}, ${langs[6].name}, ${langs[9].name}, ${langs[11].name}, ${langs[12].name}, ${langs[17].name}, ${langs[19].name}, and ${langs[23].name}, `
          );
          console.log("code: ", langs[0].language);
          console.log("lang: ", langs[0].name);
          console.log("Lang obj: ", langs);
        }
      },
    },
    {
      command: "translate",
      callback: () => {
        console.log("this command was heard.");
      },
    },
    // <<============TRANSLATION IS BROKEN, DON'T.============>>
    // {
    //   command: "how do you say * in *",
    //   callback: (phrase, lang) => {
    //     const doTranslation = async (phrase, lang) => {
    //       // convert lang => code:
    //       let queryCode = lang.toLowerCase();
    //       if (queryCode === "german") {
    //         queryCode = "DE".toLowerCase().toString();
    //       } else if (queryCode === "english") {
    //         queryCode = "EN".toLowerCase().toString();
    //       } else if (queryCode === "spanish") {
    //         queryCode = "ES".toLowerCase().toString();
    //       } else if (queryCode === "french") {
    //         queryCode = "FF".toLowerCase().toString();
    //       } else if (queryCode === "italian") {
    //         queryCode = "IT".toLowerCase().toString();
    //       } else if (queryCode === "japanese") {
    //         queryCode = "JA".toLowerCase().toString();
    //       } else if (queryCode === "portuguese") {
    //         queryCode = "PT".toLowerCase().toString();
    //       } else if (queryCode === "russian") {
    //         queryCode = "RU".toLowerCase().toString();
    //       } else if (queryCode === "chinese") {
    //         queryCode = "ZH".toLowerCase().toString();
    //       }
    //       // convert phrase into string:
    //       const queryString = phrase.split(" ").join("%20").toString();
    //       // POST req:
    //       const transText = { text: queryString };
    //       const headers = {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //       };
    //       axios
    //         .post(
    //           `http://api-free.deepl.com/v2/translate?auth_key=26b78442-234b-ac27-1823-37eb1d698edc&text=${queryString}&target_lang=${queryCode}&source_lang=en`,
    //           transText,
    //           { headers }
    //         )
    //         .then((res) => setTranslations({ text: res.data.text }))
    //         .catch((error) => {
    //           setErrorMessage({ errorMessage: error.message });
    //           console.error("Error: ", error);
    //           console.log("error: ", error);
    //           if (error.res) {
    //             console.log("err data: ", error.res.data);
    //             console.log("err status: ", error.res.status);
    //             console.log("err headers: ", error.res.headers);
    //           }
    //         });

    //       if (translations) {
    //         setMessage(`In ${lang} you would say ${phrase}`);
    //         speak({
    //           text: `In ${lang} you would say ${phrase}.`,
    //           voice: voices[voiceIndex],
    //         });
    //       } else if (!translations) {
    //         setMessage("I'm sorry, I can't fetch that data right now.");
    //         speak({
    //           text: "I'm sorry, I can't fetch that data right now.",
    //           voice: voices[voiceIndex],
    //         });
    //       }
    //     };

    //     doTranslation(phrase, lang);
    //   },
    // },
  ];
  /////////////////////////////////////////////////////////////////
  // <------------------------- HOOKS -------------------------> //
  /////////////////////////////////////////////////////////////////
  // speech synth:
  // <-----------------------------------------------------------
  // const onEnd = () => {
  //   // You could do something here after speaking has finished
  // };

  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });

  // Purpose of code below? <------------------------------------
  // I think it used to instantiate it? idk it's in the doc examples...
  const voice = voices[voiceIndex] || null;

  // // speech recog:
  // const {
  //   transcript,
  //   interimTranscript,
  //   finalTranscript,
  //   resetTranscript,
  //   listening,
  // } = useSpeechRecognition({ commands });

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    // transcribing,
    // clearTranscriptOnListen,
    commands,
  });

  /*
  useEffect(() => {
    if (interimTranscript !== '') {
      console.log('Got interim result:', interimTranscript)
    }
    if (finalTranscript !== '') {
      console.log('Got final result:', finalTranscript)
    }
  }, [interimTranscript, finalTranscript]);
  */

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

    // IN CASE OF EMERGENCY! <<<--------------------------!!
    // (Like when you try to make her read an entire monologue from Queen of the Damned for lulz and she get stuck unable to talk and you're afraid you broke it forever)
    // anyway, this is how you cancel the speech:
    // window.speechSynthesis.cancel();
    /*
    Tests:    
    console.log("speaking : ", window.speechSynthesis.speaking);
    console.log("listening : ", window.speechRecognition.listening);
    console.log("transcript : ", window.speechRecognition.transcript);
    console.log("interimTranscript : ", window.speechRecognition.interimTranscript);
    console.log("finalTranscript : ", window.speechRecognition.finalTranscript);
    console.log("commands : ", window.speechRecognition.commands);
    */

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
    // voices, <------ p sure I define this in settings anyway?
  };

  if (!browserSupportsSpeechRecognition) {
    console.log("Browser support? ", browserSupportsSpeechRecognition);
    return (
      <span>
        No browser support for Speech Recognition. Sorry, I'm trying to figure
        out polyfills{" "}
      </span>
    );
  }
  if (!supported) {
    return (
      <span>
        No browser support for Speech Synthesis. Sorry, I'm trying to figure out
        polyfills{" "}
      </span>
    );
  } else {
    return (
      <div className="page" id="VirtualAssistant">
        {/* {!supported && (
          <p>
            Oh no, it looks like your browser doesn't support Speech Synthesis.
          </p>
        )} */}
        {/* ///////////////////////////////////////////////////////////////// */}
        {/* <------------------------ COMMANDS MODAL -----------------------> */}
        {/* ///////////////////////////////////////////////////////////////// */}
        <CommandsModal isShowing={isShowing} hide={toggle} />
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
        )
      </div>
    );
  }
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

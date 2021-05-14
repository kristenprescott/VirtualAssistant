import { useState, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

export default function useSpeechSynthesis() {
  const [text, setText] = useState(
    "Hello, I'm a virtual assistant. How can I help you?"
  );
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(null);

  return {
    pitch,
    setPitch,
    rate,
    setRate,
    voiceIndex,
    setVoiceIndex,
  };
}

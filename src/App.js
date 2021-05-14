import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import VirtualAssistant from "./pages/VirtualAssistant/VirtualAssistant";
import VoiceSynthesizer from "./demo/VoiceSynthesizer/VoiceSynthesizer";
// import { SpeechContext } from "./hooks/SpeechContext";

function App() {
  return (
    <BrowserRouter>
      {/* <SpeechContext.Provider value={{ state, setState, isBool, etc }}> */}
      <Switch>
        <Route exact path="/">
          <VirtualAssistant />
        </Route>

        <Route exact path="/voicesynthesizer">
          <VoiceSynthesizer />
        </Route>
      </Switch>
      {/* </SpeechContext.Provider> */}
    </BrowserRouter>
  );
}

export default App;

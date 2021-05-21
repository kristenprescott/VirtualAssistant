import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import VirtualAssistant from "./pages/VirtualAssistant/VirtualAssistant";
import VoiceSynthesizer from "./demo/VoiceSynthesizer/VoiceSynthesizer";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import TodoForm from "./pages/Todos/TodoForm";

function App() {
  return (
    <BrowserRouter>
      {/* <SpeechContext.Provider value={{ state, setState, isBool, etc }}> */}
      <Switch>
        <Route path="/" exact component={VirtualAssistant} />
        {/* <Route exact path="/">
          <VirtualAssistant />
        </Route> */}

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

        <Route path="/dashboard" component={Dashboard} />
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
      {/* </SpeechContext.Provider> */}
    </BrowserRouter>
  );
}

export default App;

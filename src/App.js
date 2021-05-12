import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Permission from "./pages/Permission/Permission";
import Login from "./pages/Login/Login";
import Demo from "./demo/Demo/Demo";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Permission />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/demo">
            <Demo />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

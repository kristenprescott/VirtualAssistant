import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Permission from "./pages/Permission/Permission";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Demo from "./demo/Demo/Demo";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Permission />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/demo">
            <Demo />
          </Route>

          <Route path="/dashboard/:user">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

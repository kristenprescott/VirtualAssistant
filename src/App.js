import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Permission from "./pages/Permission/Permission";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Permission />
          </Route>

          {/* <Route path="/other">
            <Other />
          </Route> */}

          {/* <Route path="/another">
            <Another />
          </Route> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

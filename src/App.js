import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserContext } from "./hooks/UserContext";
import PrivateRoute from "./pages/PrivateRoute/PrivateRoute";
import Nav from "./components/Nav";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import LandingPage from "./pages/LandingPage/LandingPage";
import Demo from "./demo/Demo/Demo";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./pages/NotFound/NotFound";
import useFindUser from "./hooks/useFindUser";

function App() {
  const { user, setUser, isLoading } = useFindUser();
  return (
    <Router>
      <UserContext.Provider value={{ user, setUser, isLoading }}>
        <Nav />
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/demo" component={Demo} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          {/* <Route path="/dashboard" component={Dashboard} /> */}
          <Route component={NotFound} />
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

export default App;

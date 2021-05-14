import { NavLink, withRouter } from "react-router-dom";
import "../App.css";

const Nav = ({ history }) => {
  return (
    <nav className="navbar">
      <div className="nav-item">
        <NavLink to="/" />
        <NavLink to="/register" />
        <NavLink to="/login" />
        <NavLink to="/demo" />
        <NavLink to="/dashboard" />
      </div>
    </nav>
  );
};

export default withRouter(Nav);

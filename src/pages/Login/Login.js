import { useState, useEffect } from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom";
// import { Link, useHistory } from "react-router-dom";
=======
import { Link, useHistory } from "react-router-dom";
>>>>>>> b82c2e394d7687722648aa419f6743875b597b34
import Dashboard from "../Dashboard/Dashboard";
import "../Login/Login.css";

export default function Login() {
  // const history = useHistory();
<<<<<<< HEAD
=======

>>>>>>> b82c2e394d7687722648aa419f6743875b597b34
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------------ STATE ------------------------------------------> //
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------------ HOOKS ------------------------------------------> //
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      // console.log(token);
    }
  }, []);
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------- EVENT HANDLERS -------------------------------------> //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...loginForm }),
      });
      setLoginForm({
        username: "",
        password: "",
      });
      const data = await res.json();
      if (data.token) {
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("username", data.username);
        setLoggedIn(true);
        setLoginForm({
          username: data.username,
          password: data.password,
        });
        // history.push("/");
<<<<<<< HEAD
        console.log("username", data.username);
=======
        console.log(data.username, " is now logged in.");
>>>>>>> b82c2e394d7687722648aa419f6743875b597b34
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = (e) => {
    // clear prev token
    window.localStorage.clear();
    setLoggedIn(false);
    history.push("/login");
  };

  const handleLoginChange = (e) => {
    e.preventDefault();
    setLoginForm({
      ...loginForm,
      [e.target.id]: e.target.value,
      [e.target.username]: e.target.value,
      [e.target.password]: e.target.value,
    });
  };

  return (
    <div className="page" id="Login">
      <div>
        {isLoggedIn ? (
          <>
            <div>
              <div>
                <p>You are logged in as {loginForm.username} </p>
                <button onClick={handleLogout}>Log out?</button>
                <Dashboard />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="login-form-wrapper">
              <h1>Log in</h1>
              <form className="login-form" onSubmit={handleLogin}>
                <label htmlFor="username">
                  Username:{" "}
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                  />
                </label>
                <br />

                <label htmlFor="password">
                  Password:{" "}
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                  />
                </label>
                <br />

                <input
                  style={{ cursor: "pointer" }}
                  type="submit"
                  value="Log in"
                />
              </form>
              <div style={{ color: "blue", cursor: "pointer" }}>
                <Link to="/register">Sign up</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

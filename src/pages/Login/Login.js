import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import "../Login/Login.css";

export default function Login() {
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------------ STATE ------------------------------------------> //
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------------ HOOKS ------------------------------------------> //
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      console.log(token);
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
        email: "",
        password: "",
      });
      const data = await res.json();
      if (data.token) {
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("username", data.username);
        setLoggedIn(true);
        setLoginForm({
          username: data.username,
          email: data.email,
          password: data.password,
        });
        console.log("username", data.username);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = (e) => {
    // clear prev token
    window.localStorage.clear();
    setLoggedIn(false);
  };

  const handleLoginChange = (e) => {
    e.preventDefault();
    setLoginForm({
      ...loginForm,
      [e.target.id]: e.target.value,
      [e.target.username]: e.target.value,
      [e.target.email]: e.target.value,
      [e.target.password]: e.target.value,
    });
    // console.log("login target: ", e.target.value);
    // console.log("id: ", e.target.id);
    // console.log("username: ", e.target.username);
    // console.log("email: ", e.target.email);
    // console.log("password: ", e.target.password);
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

                <label htmlFor="email">
                  Email:{" "}
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={loginForm.email}
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
                <input type="submit" value="Log in" />
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

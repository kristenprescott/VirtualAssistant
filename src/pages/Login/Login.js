import { useState, useEffect } from "react";
import "../Login/Login.css";

export default function Login() {
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
    setLoginForm({ ...loginForm, [e.target.id]: e.target.value });
    console.log("login target: ", e.target.value);
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
                <input type="submit" value="submit" />
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

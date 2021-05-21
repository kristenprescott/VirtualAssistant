import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Login from "../Login/Login";
import "../Register/Register.css";

export default function Register() {
  const history = useHistory();
  const redirectToLogin = () => {
    history.push("/login");
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------------ STATE ------------------------------------------> //
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const [state, setState] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
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
      setRegistered(true);
    }
  }, []);
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------- EVENT HANDLERS -------------------------------------> //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("../register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...registrationForm }),
      });
      setRegistrationForm({
        username: "",
        email: "",
        password: "",
      });
      const data = await res.json();
      if (data.token) {
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("username", data.username);
        setRegistered(true);
        redirectToLogin();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegistrationChange = (e) => {
    e.preventDefault();
    setRegistrationForm({ ...registrationForm, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // change this later its janky and probs unsafe
    setState(true);
  };

  return (
    <div>
      {state ? (
        <Login />
      ) : (
        <div>
          <h1>Registration</h1>
          <div>
            <form className="registration-form" onSubmit={handleRegistration}>
              <label htmlFor="username">
                Username:{" "}
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={registrationForm.username}
                  onChange={handleRegistrationChange}
                />
              </label>
              <br />
              <label htmlFor="email">
                Email:{" "}
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={registrationForm.email}
                  onChange={handleRegistrationChange}
                />
              </label>
              <br />
              <label htmlFor="password">
                Password:{" "}
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={registrationForm.password}
                  onChange={handleRegistrationChange}
                />
              </label>
              <br />
              <input
                style={{ cursor: "pointer" }}
                type="submit"
                value="Register"
                onSubmit={handleSubmit}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

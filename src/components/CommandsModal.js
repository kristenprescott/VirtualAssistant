import React from "react";
import ReactDOM from "react-dom";

const CommandsModal = ({ isShowing, hide }) =>
  isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div
            className="modal-wrapper"
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
          >
            <div className="modal">
              <div className="modal-header">
                <button
                  type="button"
                  className="modal-close-button"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={hide}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <center>
                <h1>Commands: </h1>
                <hr />
                <br />
              </center>
              {/* <ul> */}
              {/* <center> */}
              {/* <h2>Verbal response:</h2> */}
              {/* </center> */}
              {/* <li>▸ ["hello", "hi"]</li> */}
              {/* <li>▸ "(hello) my name is *"</li> */}
              {/* <li>▸ "help"</li> */}
              {/* <li>▸ "up up down down left right left right b a (start)"</li> */}
              {/* </ul> */}
              <ul>
                <center>
                  <h2>Action response:</h2>
                </center>
                {/* <li>
                  ▸ "reset" <strong>:|:</strong> reset transcript
                </li> */}
                <li>▸ "clear" :|: clear transcript(spoken words)</li>
                <li>
                  ▸ ["(get) commands", "show commands"] :|: open commands modal
                </li>
                {/* <li>
                  ▸ ["log in", "login"] :|: open login page(opens in same
                  window; **currently does not offer 'go back' functionality -
                  note to self :|: fix that.)
                </li> */}
                {/* <li>
                  ▸ ["register", "sign up", "signup"] :|: open registration page
                </li> */}
                {/* <li>▸ "demo" :|: opens demo</li> */}
                {/* <li>
                  ▸ "go to voice synthesizer" :|: opens voice synthesizer(*note
                  to self* :|: should be deprecated)
                </li> */}
                <li>▸ "(go) back" :|: browser back</li>
                <li>▸ "(go) forward" :|: browser forward</li>
                <li>▸ "open webpage *" :|: opens "http:// * .com"</li>
                <li>▸ "search google for *" :|: searches google for *</li>
                <li>
                  ▸ "google search exact *" :|: searches google for exact *
                </li>
                <li>
                  ▸ "add new task *" :|: gets new task ready to add to list
                </li>
                <li>
                  ▸ "(yes) create new task" :|: adds new task to todo list
                </li>
                <li>
                  ▸ ["show me my to-do list", "show me my to-dos", "set to-dos",
                  "add to to-do list"] :|: opens to-do list
                </li>
                <li>
                  ▸ "show settings" :|: shows settings view; changes made here
                  persist
                </li>
                <li>▸ "hide settings" :|: hides settings view</li>
                <li>
                  ▸ "whisper *" :|: whispers "okay, " + the words that follow;
                  ideally, this will instead set whisper mode in the future
                </li>
                <center>
                  <li>
                    <h4>Weather:</h4>
                  </li>
                </center>
                <li>
                  ▸ "fetch weather" :|: fetches weather data; **note** :|: we're
                  working on fixing the need for this command, but for now,
                  weather data must be fetched this way (only once) before
                  making other weather commands.
                </li>
                <li>
                  ▸ ["(current) weather", "what's the weather", "what is the
                  weather", "tell me the weather"] :|: gives current weather
                  description
                </li>
                <li>▸ "current temperature" :|: gives current temperature</li>
                <li>
                  ▸ ["(current) moon phase", "what's the moon phase", "what
                  phase is the moon (in)"] :|: gives (currently incorrect I
                  believe, I need to work on that function...) the current moon
                  phase.
                </li>
                {/* <li>
                  ▸ "current sunrise" :|: gives today's sunrise time.(or, it
                  would if I could figure out that UTC/Linux time conversion
                  thing)
                </li> */}
                <center>
                  <li>
                    <h4>Time:</h4>
                  </li>
                </center>
                <li>
                  "set (a) timer for :timeout seconds" :|: sets a timer for
                  :number seconds
                </li>
                <li>
                  ▸ "set a timer for :timeout minute" :|: sets a timer for
                  :number minutes
                </li>
                <li>
                  ▸ "what time is it" :|: responds with the time (24hr only for
                  now)
                </li>
                <li>
                  ▸ ["what is todays date", "what's today's date", "what's the
                  date" ] :|: responds with the date (YYYY-MM-DD)
                </li>
                <li>▸ "what day is it" :|: responds with the weekday</li>
              </ul>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
// }

export default CommandsModal;

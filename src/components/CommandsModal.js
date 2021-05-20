// https://upmostly.com/tutorials/modal-components-react-custom-hooks
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
              <ul>
                <center>
                  <h2>Verbal response:</h2>
                </center>
                <li>▸ ["hello", "hi"]</li>
                <li>▸ "(hello) my name is *"</li>
                <li>▸ "help"</li>
                <li>▸ "up up down down left right left right b a (start)"</li>
              </ul>
              <ul>
                <center>
                  <h2>Action response:</h2>
                </center>
                <li>
                  ▸ "reset" <strong>:|:</strong> reset transcript
                </li>
                <li>▸ "clear" :|: clear transcript</li>
                <li>
                  ▸ ["quit", "end", "exit"] :|: end listening(no longer needed)
                </li>
                <li>
                  ["(get) commands", "show commands"] :|: open commands modal
                </li>
                <li>
                  ▸ ["log in", "login"] :|: open login page(opens in same
                  window; **currently does not offer 'go back' functionality -
                  note to self :|: fix that.)
                </li>
                <li>
                  ▸ ["register", "sign up", "signup"] :|: open registration page
                </li>
                <li>▸ "demo" :|: opens demo</li>
                <li>
                  ▸ "go to voice synthesizer" :|: opens voice synthesizer(*note
                  to self* :|: should be deprecated)
                </li>
                <li>▸ "(go) back" :|: browser back</li>
                <li>▸ "(go) forward" :|: browser forward</li>
                <li>▸ "open webpage *" :|: opens "http:// * .com"</li>
                <li>▸ "search google for *" :|: searches google for *</li>
                <li>
                  ▸ "google search exact *" :|: searches google for exact *
                </li>
                <li>
                  [ "show me my to do list", "show me my to-do list", "show me
                  my to-dos", "set to-dos", "add to to-do list", ] :|: opens
                  to-do list
                </li>
                <li>▸ "show settings" :|: conditionally shows settings view</li>
                <li>▸ "hide settings" :|: conditionally hides settings view</li>
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
                  ▸ [ "(current) weather", "what's the weather", "what is the
                  weather", "tell me the weather", ] :|: gives current weather
                  description
                </li>
                <li>▸ "current temperature" :|: gives current temperature</li>
                <li>
                  ▸ [ "(current) moon phase", "what's the moon phase", "what
                  phase is the moon (in)", ] :|: gives (currently incorrect I
                  believe, I need to work on that function...) the current moon
                  phase.
                </li>
                <li>
                  ▸ "current sunrise" :|: gives today's sunrise time.(or, it
                  would if I could figure out that UTC/Linux time conversion
                  thing)
                </li>
              </ul>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
// }

export default CommandsModal;
/*
Most of the code above is self-explanatory. Modal is a stateless functional component that takes two props and only returns HTML when isShowing is true.

- Portals - allow React components to render in another part of the DOM that is outside of their parent component.
We can use a Portal to mount our Modal component to the end of the document.body element, rather than as a child of another component.

Specify two arguments to the createPortal function: the modal component we want to render and the location of where we want to append the component.
*/

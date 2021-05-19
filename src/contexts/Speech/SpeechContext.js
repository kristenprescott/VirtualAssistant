// contexts/Speech/index.jsx
import React from "react";
import { reducer, initialState } from "./reducer";

export const SpeechContext = React.createContext({
  state: initialState,
  dispatch: () => null,
});

export const SpeechProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <SpeechContext.Provider value={[state, dispatch]}>
      {children}
    </SpeechContext.Provider>
  );
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
The next step is to wrap our entire application (or at least as much as would ever need access to the global state) in that Provider component. This is a pretty common look:

// components/App.jsx

import { UserProvider } from "../contexts/UserProvider"

// Some other components you've written for your app...
import Header from "./Header"
import Main from "./Main"

export default () => {
  return (
    <UserProvider>
      <Header />
      <Main />
    </UserProvider>
  )
}
*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
Finally, any component that wants access to the global state and/or dispatch functions just needs to import the context and reference it in a useContext hook:

// components/MyButton.jsx

import React from "react"
import { UserContext } from "../contexts/User"

export default () => {
  const [ state, dispatch ] = React.useContext(UserContext)

  return (
    <button onClick={() => dispatch({ type: "toggle_button" })}>
      { state.active ? "On" : "Off" }  
    </button>
  )
}
*/
/*
The resulting two-value array that we destructure into references to the global state and dispatch provided by the useReducer call, since that's how we structured the array that we passed into the value prop for the context's provider component. That's it!

Any number of components can use this context and a dispatched action from any of them that mutates the state will update all of them appropriately. The reducer function can be easily updated with additional state properties and action types.
*/

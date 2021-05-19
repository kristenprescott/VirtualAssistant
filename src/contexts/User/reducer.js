// contexts/User/reducer.js

export const reducer = (state, action) => {
  switch (action.type) {
    case "toggle_button":
      return {
        ...state,
        active: !state.active,
      };

    default:
      return state;
  }
};

export const initialState = {
  active: false,
};
///////////////////////////////////////////
// // We can use this on its own in any React component to create a reducer function-powered state, but only available to that component:

// const [state, dispatch] = React.useReducer(reducer, initialState);

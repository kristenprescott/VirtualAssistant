// import React from 'react';
import useToggle from "../hooks/useToggle";
// import { RiEyeCloseLine, RiEyeFill } from "react-icons/ri";
import Open from "../assets/images/icons/eye-open.png";
import Close from "../assets/images/icons/eye-close.png";

export default function ConfirmPaswordInput(props) {
  let fail = props.fail;
  const { newState, handleToggle } = useToggle(false);

  return (
    <div className="flex column padBottomThree">
      <div className="input__pass">
        <input
          type={newState ? "text" : "password"}
          className={`input ${fail ? "input--fail" : null} `}
          placeholder={props.placeholder}
          name={props.name}
          value={props.value}
          onChange={props.handleChange}
          onKeyDown={props.handleKeyDown}
        />
        <span className="showPasswordButton" onClick={handleToggle}>
          {newState ? (
            <image src={Open} style={{ width: "150px" }} />
          ) : (
            <image src={Close} style={{ width: "150px" }} />
          )}
        </span>
      </div>
      <input
        type={newState ? "text" : "password"}
        className={`input ${fail ? "input--fail" : null} `}
        placeholder={props.placeholderConfirm}
        name={props.nameConfirm}
        value={props.valueConfirm}
        onChange={props.handleChange}
        onKeyDown={props.handleKeyDown}
      />
    </div>
  );
}

import React from "react";
import useToggle from "../../hooks/Auth/useToggle";
// import { RiEyeCloseLine, RiEyeFill } from "react-icons/ri";
import open from "../../assets/images/icons/eye-open.png";
import close from "../../assets/images/icons/eye-close.png";

export default function ConfirmPasswordInput(props) {
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
            // <RiEyeFill className="icon" />
            <img src={open} style={{ width: "20px" }} />
          ) : (
            // <RiEyeCloseLine className="icon" />
            <img src={close} style={{ width: "20px" }} />
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

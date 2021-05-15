// https://upmostly.com/tutorials/modal-components-react-custom-hooks
import { useState } from "react";

const useCommandsModal = () => {
  // export default function useCommandsModal() {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing(!isShowing);
  }
  //   const toggle = () => {
  // setIsShowing(!isShowing);
  //   };

  return {
    isShowing,
    toggle,
  };
};

export default useCommandsModal;

import { useState } from "react";

export default function TodoForm() {
  ///////////////////////////////////
  // STATE
  ///////////////////////////////////
  const [task, setTask] = useState();

  ///////////////////////////////////
  // EVENT LISTENERS
  ///////////////////////////////////
  const handleChange = () => {
    //
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    //
  };

  return (
    <div>
      <h1>TODO LIST</h1>
      <form onSubmit={() => {}}>
        <label htmlFor="">
          <input type="text" name="task" value={task} onChange={handleChange} />
        </label>
      </form>
    </div>
  );
}

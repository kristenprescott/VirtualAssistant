import { useEffect, useState } from "react";
import TodoAPIHelper from "../../helpers/TodoAPIHelper";
import "./TodoForm.css";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
// import { useSpeechSynthesis } from "react-speech-kit";

export default function TodoForm() {
  ///////////////////////////////////
  // STATE
  ///////////////////////////////////
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  // const [todo, setTodo] = useState("");
  // GET ALL
  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const todos = await TodoAPIHelper.getAllTodos();
      setTodos(todos);
    };
    fetchTodoAndSetTodos();
  }, []);
  // // GET one
  // const fetchTodo = async () => {
  //   const todo = await TodoAPIHelper.getTodo();
  //   setTodo();
  // };
  // CREATE
  const createTodo = async (e) => {
    e.preventDefault();
    // check if todo is empty:
    if (!newTodo) {
      console.log("no todo entered.");
      return;
    }
    // check if todo already exists:
    if (todos.some(({ task }) => task === newTodo)) {
      alert(`Task: ${newTodo} already exists`);
      return;
    }
    // create todo:
    const newTask = await TodoAPIHelper.createTodo(newTodo);
    // add todo to the list:
    setTodos([...todos, newTask]);
  };
  // UPDATE
  const updateTodo = async (e, id) => {
    e.stopPropagation();
    const payload = {
      done: !todos.find((todo) => todo._id === id).done,
    };
    const updatedTodo = await TodoAPIHelper.updateTodo(id, payload);
    setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
  };
  // DELETE
  const deleteTodo = async (e, id) => {
    try {
      e.stopPropagation();
      await TodoAPIHelper.deleteTodo(id);
      setTodos(todos.filter(({ _id: i }) => id !== i));
    } catch (err) {
      console.log(err);
    }
  };

  // const {
  //   transcript,
  //   interimTranscript,
  //   finalTranscript,
  //   resetTranscript,
  //   listening,
  // } = useSpeechRecognition({ commands });

  return (
    <div className="TodoForm">
      <h1 className="todo-list-title">Todo List</h1>

      {/* <hr></hr> */}

      <div className="todo-input-container">
        <div className="todo-input-wrapper">
          <input
            id="todo-input"
            type="text"
            value={newTodo}
            onChange={({ target }) => setNewTodo(target.value)}
          />
          <button className="todo-add-btn" type="button" onClick={createTodo}>
            Add
          </button>
        </div>

        <hr></hr>

        <div className="todo-list-wrapper">
          <ul className="todo-list">
            {todos.map(({ _id, task, done }, i) => (
              <div className="list-item-wrapper" key={i}>
                <div>❏</div>{" "}
                <li
                  onClick={(e) => updateTodo(e, _id)}
                  // className={done ? "done" : ""}
                  className="list-item"
                >
                  {task}{" "}
                </li>
                <div
                  className="todo-delete"
                  onClick={(e) => deleteTodo(e, _id)}
                >
                  <span>&times;</span>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
/////////////////////////
/*
We start by creating two states: todo and todos. States are like information about your components. todo will store the user input when creating a new todo and todos will store all of our todos.
*/

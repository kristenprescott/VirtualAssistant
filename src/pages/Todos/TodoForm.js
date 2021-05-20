import { useEffect, useState } from "react";
import TodoAPIHelper from "../../helpers/TodoAPIHelper";

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

  return (
    <div
      style={{
        margin: "25px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>TODO LIST</h1>

      <hr></hr>

      <div className="">
        <div>
          <input
            id="todo-input"
            type="text"
            value={newTodo}
            onChange={({ target }) => setNewTodo(target.value)}
          />
          <button type="button" onClick={createTodo}>
            Add
          </button>
        </div>

        <ul>
          {todos.map(({ _id, task, done }, i) => (
            <li
              style={{ cursor: "pointer", backgroundColor: "gainsboro" }}
              key={i}
              onClick={(e) => updateTodo(e, _id)}
              className={done ? "done" : ""}
            >
              {task}{" "}
              <span
                style={{ backgroundColor: "red", cursor: "pointer" }}
                onClick={(e) => deleteTodo(e, _id)}
              >
                X
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
/////////////////////////
/*
We start by creating two states: todo and todos. States are like information about your components. todo will store the user input when creating a new todo and todos will store all of our todos.
*/

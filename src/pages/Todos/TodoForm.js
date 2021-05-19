import { useEffect, useState } from "react";

export default function TodoForm() {
  ///////////////////////////////////
  // STATE
  ///////////////////////////////////
  const [updatedTodo, setUpdatedTodo] = useState(false);
  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState({
    task: "",
    done: null,
    createdAt: null,
    user_id: "",
  });
  //////////////////////
  // get todos
  /////////////////
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8080/todos/");
        const data = await res.json();
        setTodo(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  ///////////////////////////////////
  // EVENT LISTENERS
  ///////////////////////////////////
  // set new todos
  ///////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/todos/addTodo/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });
      const data = await res.json();
      setTodo([...todo, data]);
      // clear input
      setNewTodo({
        task: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();

    setNewTodo({ ...newTodo, [e.target.task]: e.target.value });
  };
  ///////////////////////////////////
  // delete todos
  ///////////////////
  const handleDelete = async (e, id, idx) => {
    e.preventDefault();

    // make del req to api
    try {
      const res = await fetch(`http://localhost:8080/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application.json",
        },
      });
      const data = res.json();
      // remove todo from list
      const copyTask = [...todo];
      // remove item at index
      copyTask.splice(idx, 1);
      // setTodo
      setTodo(copyTask);
    } catch (error) {
      console.error(error);
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

      <div
        style={{
          margin: "30px",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "flex-start",
        }}
        id="todo"
      >
        {todo.map((todo, idx) => (
          <div key={todo.id}>
            <p>{todo.task}</p>
            <button
              onClick={(e) => {
                handleDelete(e, todo.id, idx);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <hr></hr>

      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="task">
            Task:{" "}
            <input
              type="text"
              name="task"
              value={newTodo.task}
              onChange={handleChange}
            />
          </label>
          <input type="submit" />
        </form>
      </div>
    </div>
  );
}

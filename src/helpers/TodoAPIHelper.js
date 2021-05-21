import axios from "axios";

// const API_URL = "http://localhost:8080/todos";
const API_URL = "https://virtual-assist-backend.herokuapp.com/todos";

//GET all
async function getAllTodos() {
  const { data: todos } = await axios.get(API_URL);
  return todos;
}
// GET one
async function getTodo(id) {
  const { data: todo } = await axios.get(`${API_URL}/${id}`);
  return todo;
}
// CREATE
async function createTodo(task) {
  const { data: newTodo } = await axios.post(`${API_URL}/new`, {
    task,
  });
  return newTodo;
}
// UPDATE
async function updateTodo(id, payload) {
  const { data: newTodo } = await axios.patch(`${API_URL}/${id}`, payload);
  return newTodo;
}
// DELETE
async function deleteTodo(id) {
  const message = await axios.delete(`${API_URL}/${id}`);
  // console.log("deleted todo id: ", id);
  return message;
}

export default { getAllTodos, getTodo, createTodo, updateTodo, deleteTodo };
//////////////////////////////////////////////////////////////////////////////////
// getAllTodos:                                                                 //
//      fetching all the todos from our API via axios.get                       //
// createTodo(task):                                                            //
//      accepts a task and sends a post via axios.post to our API_URL and       //
//      returns the newTodo. Note: axios stores the response of our requests    //
//      in a field called data                                                  //
// updateTodo:                                                                  //
//      accepts an id and a payload object contain fields that we want to       //
//      update => payload= {completed: true} .It sends a PUT request to update  //
//      the todo                                                                //
// deleteTodo(id):                                                              //
//      accepts an id and sends a delete request to our API.                    //
// ---------------------------------------------------------------------------- //
// And we make all these functions accessible in other files using an export    //
// function export default { createTodo, deleteTodo, updateTodo, getAllTodos }; //
//////////////////////////////////////////////////////////////////////////////////

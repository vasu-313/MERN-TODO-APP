import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";

export const App = () => {

  const [newTodo, setNewTodo] = useState("");

  const [todos, setTodos] = useState([]);

  const [editingTodo, setEditingTodo] = useState(null);

  const [editedText, setEditedText] = useState("")

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post("/api/todos", { text: newTodo })
      setTodos([...todos, response.data])
      setNewTodo('');
    } catch (error) {
      console.log("Error adding todo:", error)
    }
  }

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data)
    } catch (error) {
      console.log("error fetching todos:", error)
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id)
    setEditedText(todo.text)
  }

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText
      })
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo ) ))
      setEditingTodo(null)
    } catch  (error) {
      console.log("error updating todo:", error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) =>  todo._id !== id))
    } catch (error) {
      console.log("error deleting todo:", error)
    }
  }

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id)
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed
      })
      setTodos(todos.map((t) => t._id === id ? response.data : t))
    } catch (error) {
      console.log("Error toggline todo:", error)
    }
  } 


  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-500
    flex items-center justify-center p-4' >
        <div className='bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-center' >

          <h1 className='text-4xl font-bold text-green-800 mb-8' >Task Manager</h1>

          <form onSubmit={addTodo}
            className='flex items-center gap-2 shadow-sm border border-green-200 p-2 rounded-lg'>
            <input className='flex-1 outline-none px-3 py-2 text-green-900 placeholder-green-800'
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder='What needs to be done?'
              required
            />
            <button type='submit'
              className='bg-green-800 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium'  >Add Task</button>
          </form>
          <div className='mt-4' >
            {todos.length === 0 ? (
              <div></div>
            ) : (
              <div  className='flex flex-col gap-4' >
                {todos.map((todo) => (
                  <div key={todo._id} >
                    {editingTodo === todo._id ? (
                      <div className='flex items-center gap-x-3' >
                        <input className='flex-1 p-3 border rounded-lg border-green-200 outline-none
                        focus:ring-2 focus:ring-black text-green-700 shadow-inner'
                          type="text" value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                        />
                        <div className='flex gap-x-2' >
                          <button onClick={() => saveEdit(todo._id)}
                           className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer' >
                            <MdOutlineDone />
                          </button>
                          <button className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer'
                            onClick={() => setEditingTodo(null)} >
                            <IoClose />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className='flex items-center justify-between ' >
                          <div className='flex items-center gap-x-4 overflow-hidden ' >
                            <button onClick={() => toggleTodo(todo._id)}
                             className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center
                              ${todo.completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-blue-400"}`} >
                              {todo.completed && <MdOutlineDone />}
                            </button>
                            <span className='text-gray-800 font-medium truncate' >{todo.text}</span>
                          </div>
                          <div className='flex gap-x-2' >
                            <button className='p-2 text-green-500 hover:text-green-700 rounded-lg hover:bg-green-50 duration-200'
                              onClick={() => startEditing(todo)} >
                              <MdModeEditOutline />
                            </button>
                            <button  onClick={() => deleteTodo(todo._id)}
                             className='p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-green-50 duration-200' >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

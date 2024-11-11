import { useState, useEffect } from "react";
import React from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [listTask, setListTask] = useState([]);
  const [editValue, setEditValue] = useState(""); // Valor de la tarea que se edita
  const [editTaskId, setEditTaskId] = useState(null); // ID de la tarea que se está editando

  const getListToDOs = async () => {
    try {
      const response = await fetch("https://playground.4geeks.com/todo/users/luis");
      const result = await response.json();
      setListTask(result.todos);
    } catch (error) {
      console.log("Error al obtener las tareas");
    }
  };

  const saveTask = async () => {
    try {
      const body = {
        label: inputValue,
        is_done: false,
      };
      const response = await fetch("https://playground.4geeks.com/todo/todos/luis", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        alert("Tarea exitosa");
      }
      const result = await response.json();
      setListTask((prevState) => [...prevState, result]);
      setInputValue("");
    } catch (error) {
      console.error("Error al guardar las tareas");
    }
  };

  const deleteList = async (id) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
        },
      });
      if (response.ok) {
        setListTask((prevState) => prevState.filter((task) => task.id !== id));
      } else {
        alert("Error al eliminar la tarea");
      }
    } catch (error) {
      console.log("Error al eliminar tarea");
    }
  };

  const putList = async (id, newLabel) => {
    try {
      const body = {
        label: newLabel,
        is_done: false, 
      };
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        // Actualizar la tarea en el estado local
        setListTask((prevState) =>
          prevState.map((task) => (task.id === id ? { ...task, label: newLabel } : task))
        );
        setEditTaskId(null); // Limpia el id de la tarea en edición
        setEditValue(""); // Limpia el valor temporal de edición
      } else {
        alert("Error al actualizar la tarea");
      }
    } catch (error) {
      console.log("Error al actualizar tarea");
    }
  };

  useEffect(() => {
    getListToDOs();
  }, []);

  return (
    <>
      <div className="container-fluid">

      <div className="container ">
        <input className="input-primary"
          placeholder="Añadir nueva tarea"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          style={{ marginRight: "10px" }}
          type="text"
        />
        <button className="btn btn-success " onClick={saveTask}>Agregar Tarea</button>
      </div>

      <div className="container  ">
        <ul className="list-group d-flex justify-content-center mt-2">
            {listTask.map((task) => (
              <li className="list-group-item d-flex gap-2" key={task.id}>
                    {editTaskId === task.id ? (
                      // Mostrar input de edición si el id de la tarea coincide
                      <>
                        <input className="input-edit"
                          value={editValue}
                          onChange={(event) => setEditValue(event.target.value)}
                        />

                        <button className="btn btn-outline-success " onClick={() => putList(task.id, editValue)}>
                          Actualizar
                        </button>
                        
                      </>
                    ) : (
                      // Mostrar tarea si no está en modo edición
                    <>
                      {task.label}
                                
                      <button className="btn btn-outline-info"
                        onClick={() => {
                        setEditTaskId(task.id); // Establece el id de la tarea en edición
                        setEditValue(task.label); // Establece el valor actual de la tarea en el input de edición
                        }}
                        style={{ marginLeft: "80px" }}
                        >
                        Edit✍️
                        </button>
                        <button className="btn btn-outline-danger  me-1 " onClick={() => deleteList(task.id)}>x</button>
                            
                    </>
                        )}
              </li>
            ))}
        </ul>
        
      </div>
      </div>
    </>
  );
};

export default Home;




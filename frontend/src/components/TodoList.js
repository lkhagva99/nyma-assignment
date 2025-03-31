import React from "react";
import "./Todo.css";

function TodoList({ todos, onToggle, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  const [student, setStudent] = React.useState({
    firstName: "Nymdorj",
    lastName: "Baasandorj",
    studentCode: "2019000000",
  });

  return (
    <div>
      <h1>Сайн уу, {student?.firstName || "Nymdorj"}</h1>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="todo-checkbox"
            />
            <div className="todo-content">
              <span className="todo-text">{todo.text}</span>
              <div className="todo-details">
                <span className={`todo-type ${todo.type.toLowerCase()}`}>
                  {todo.type}
                </span>
                {todo.deadlineDate && (
                  <span className="todo-deadline">
                    Дуусах: {formatDate(todo.deadlineDate)}
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => onDelete(todo.id)} className="todo-delete">
              Устгах
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;

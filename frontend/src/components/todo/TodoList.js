import React from "react";
import "./Todo.css";

function TodoList({ todos, onToggle, onDelete, onAddClick, onEdit }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <ul className="todo-list">
        <li>
          <button className="todo-add" onClick={onAddClick}>Нэмэх</button>
        </li>
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={`todo-item ${todo.status === 'completed' ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.status === 'completed'}
              onChange={() => onToggle(todo._id)}
              className="todo-checkbox"
            />
            <div className="todo-content">
              <span className="todo-text">{todo.title}</span>
              {todo.description && (
                <p className="todo-description-text">{todo.description}</p>
              )}
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
            <div className="todo-actions">
              <button onClick={() => onEdit(todo)} className="todo-edit">
                Засах
              </button>
              <button onClick={() => onDelete(todo._id)} className="todo-delete">
                Устгах
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;

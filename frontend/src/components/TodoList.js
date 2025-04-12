import React from "react";
import "./Todo.css";

function TodoList({ todos, onToggle, onDelete, onAddClick }) {
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

  React.useEffect(() => {
    console.log(todos)
    const user = JSON.parse(localStorage.getItem('user'));
    setStudent(user);
  }, []);

  return (
    <div>
      <h1>Сайн уу, {student?.firstName || "Nymdorj"}</h1>
      <ul className="todo-list">
        <li>
          <button className="todo-add" onClick={onAddClick}>Үүсгэх</button>
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
            <button onClick={() => onDelete(todo._id)} className="todo-delete">
              Устгах
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;

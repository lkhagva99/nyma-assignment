import React, { useState } from 'react';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import './Todo.css';

const TODO_TYPES = {
  EXAM: 'Exam',
  ASSIGNMENT: 'Assignment',
  LAB: 'Lab'
};

function Todo() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todoData) => {
    if (todoData.text.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: todoData.text,
        type: todoData.type,
        deadlineDate: todoData.deadlineDate,
        completed: false
      };
      setTodos([...todos, newTodo]);
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-container">
      <h1>Таск жагсаалт</h1>
      <TodoForm onSubmit={addTodo} todoTypes={Object.values(TODO_TYPES)} />
      <TodoList 
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}

export default Todo; 
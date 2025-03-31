import React, { useState } from 'react';
import './Todo.css';

function TodoForm({ onSubmit, todoTypes }) {
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState(todoTypes[0]);
  const [deadlineDate, setDeadlineDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      text: input,
      description: description,
      type: selectedType,
      deadlineDate: deadlineDate || null
    });
    setInput('');
    setDescription('');
    setDeadlineDate('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
          className="todo-input"
          required
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="todo-type-select"
        >
          {todoTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="todo-form-row">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description (optional)"
          className="todo-description"
        />
      </div>
      <div className="todo-form-row">
        <input
          type="datetime-local"
          value={deadlineDate}
          onChange={(e) => setDeadlineDate(e.target.value)}
          className="todo-date-input"
          placeholder="Deadline (optional)"
        />
        <button type="submit" className="todo-button">
          Add Todo
        </button>
      </div>
    </form>
  );
}

export default TodoForm; 
import React, { useState, useEffect } from 'react';
import './Todo.css';

function TodoForm({ onSubmit, todoTypes, chosenCategory, todo }) {
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');

  useEffect(() => {
    if (todo) {
      setInput(todo.title);
      setDescription(todo.description || '');
      setSelectedType(todo.type);
      setDeadlineDate(todo.deadlineDate ? new Date(todo.deadlineDate).toISOString().slice(0, 16) : '');
    } else {
      // Set default type based on available options
      const availableTypes = chosenCategory?.subTypes || todoTypes;
      setSelectedType(availableTypes[0] || '');
    }
  }, [todo, chosenCategory, todoTypes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      text: input,
      description: description,
      type: selectedType,
      deadlineDate: deadlineDate || null,
      category: chosenCategory?._id || null,
      id: todo?._id
    });
    if (!todo) {
      setInput('');
      setDescription('');
      setDeadlineDate('');
    }
  };

  const availableTypes = chosenCategory?.subTypes || todoTypes;

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Таск нэмэх..."
          className="todo-input"
          required
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="todo-type-select"
          required
        >
          {availableTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="todo-form-row">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Тайлбар оруулах (сонголтоор)"
          className="todo-description"
        />
      </div>
      <div className="todo-form-row">
        <input
          type="datetime-local"
          value={deadlineDate}
          onChange={(e) => setDeadlineDate(e.target.value)}
          className="todo-date-input"
          placeholder="Дуусах огноо (сонголтоор)"
        />
        <button type="submit" className="todo-button">
          {todo ? 'Хадгалах' : 'Таск нэмэх'}
        </button>
      </div>
    </form>
  );
}

export default TodoForm; 
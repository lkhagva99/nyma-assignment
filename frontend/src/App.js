import React, { useState, useCallback } from "react";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import TodoCountdown from "./components/TodoCountdown";
import Modal from "./components/Modal";
import "./components/Todo.css";

function App() {
  // Initial test todos
  const initialTodos = [
    {
      id: 1,
      text: "Complete React Project",
      description:
        "Implement all features and test thoroughly before submission",
      type: "Work",
      deadlineDate: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(), // 2 days from now
      completed: false,
    },
    {
      id: 2,
      text: "Gym Session",
      description: "Cardio and strength training",
      type: "Health",
      deadlineDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
      completed: false,
    },
    {
      id: 3,
      text: "Grocery Shopping",
      description: "Buy vegetables, fruits, and weekly essentials",
      type: "Shopping",
      deadlineDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
      completed: true,
    },
    {
      id: 4,
      text: "Read Design Patterns Book",
      description: "Focus on creational and structural patterns",
      type: "Personal",
      deadlineDate: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(), // 5 days from now
      completed: false,
    },
    {
      id: 5,
      text: "Dentist Appointment",
      description: "Regular checkup and cleaning",
      type: "Health",
      deadlineDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago (overdue)
      completed: false,
    },
    {
      id: 6,
      text: "Team Meeting",
      description: "Sprint planning and task assignment",
      type: "Work",
      deadlineDate: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
      completed: false,
    },
    {
      id: 7,
      text: "Birthday Gift Shopping",
      description: "Find a perfect gift for mom's birthday",
      type: "Shopping",
      deadlineDate: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(), // 3 days from now
      completed: false,
    },
    {
      id: 8,
      text: "Write Blog Post",
      description:
        "Article about React best practices and performance optimization",
      type: "Personal",
      deadlineDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(), // 7 days from now
      completed: false,
    },
    {
      id: 9,
      text: "Yoga Class",
      description: "Morning yoga session for flexibility and mindfulness",
      type: "Health",
      deadlineDate: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // 20 hours from now
      completed: false,
    },
    {
      id: 10,
      text: "Code Review",
      description: "Review pull requests from the team",
      type: "Work",
      deadlineDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
      completed: true,
    },
    {
      id: 11,
      text: "Home Cleaning",
      description: "Deep clean the house and organize closets",
      type: "Personal",
      deadlineDate: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(), // 2 days from now
      completed: false,
    },
    {
      id: 12,
      text: "Client Presentation",
      description: "Present the new feature proposals to the client",
      type: "Work",
      deadlineDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
      completed: false,
    },
    {
      id: 13,
      text: "Pay Bills",
      description: "Pay utility bills and rent",
      type: "Personal",
      deadlineDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago (overdue)
      completed: false,
    },
    {
      id: 14,
      text: "Buy New Laptop",
      description: "Research and purchase new development machine",
      type: "Shopping",
      deadlineDate: new Date(
        Date.now() + 10 * 24 * 60 * 60 * 1000
      ).toISOString(), // 10 days from now
      completed: false,
    },
    {
      id: 15,
      text: "Dental X-Ray",
      description: "Get dental x-rays for upcoming procedure",
      type: "Health",
      deadlineDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours from now
      completed: false,
    },
    {
      id: 16,
      text: "Update Portfolio",
      description: "Add recent projects and update skills section",
      type: "Personal",
      deadlineDate: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000
      ).toISOString(), // 14 days from now
      completed: false,
    },
  ];

  const [todos, setTodos] = useState(initialTodos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 20;

  const todoTypes = ["Personal", "Work", "Shopping", "Health", "Other"];

  const handleAddTodo = (todo) => {
    const newTodo = {
      ...todo,
      id: Date.now(),
      completed: false,
    };
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    setIsModalOpen(false);
  };

  const handleToggle = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const loadMore = useCallback(() => {
    // In a real app, this would be an API call
    setPage((prevPage) => prevPage + 1);
    // Simulate end of data after 5 pages
    if (page >= 5) {
      setHasMore(false);
    }
  }, [page]);

  const displayedTodos = todos.slice(0, page * ITEMS_PER_PAGE);

  return (
    <div className="app">
      <TodoList
        todos={displayedTodos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onLoadMore={loadMore}
        hasMore={hasMore}
        onAddClick={() => setIsModalOpen(true)}
      />
      <TodoCountdown todos={todos} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TodoForm onSubmit={handleAddTodo} todoTypes={todoTypes} />
      </Modal>
    </div>
  );
}

export default App;

import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import TodoCountdown from "./components/TodoCountdown";
import Modal from "./components/Modal";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import "./components/Todo.css";

function TodoApp() {
  const todoTypes = ["Lab", "Assignment", "Exam"];

  const initialTodos = [
    {
      id: 1,
      text: "Complete React Project",
      description: "Implement all features and test thoroughly before submission",
      type: "Assignment",
      deadlineDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 2,
      text: "Data Structures Lab",
      description: "Implement binary search tree operations",
      type: "Lab",
      deadlineDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 3,
      text: "Database Design Assignment",
      description: "Design ERD for library management system",
      type: "Assignment",
      deadlineDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      completed: true,
    },
    {
      id: 4,
      text: "Machine Learning Lab",
      description: "Implement linear regression from scratch",
      type: "Lab",
      deadlineDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 5,
      text: "Final Exam",
      description: "Comprehensive exam covering all course materials",
      type: "Exam",
      deadlineDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 6,
      text: "Team Project Lab",
      description: "Group coding session for project implementation",
      type: "Lab",
      deadlineDate: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 7,
      text: "Research Paper Assignment",
      description: "Write paper on latest AI developments",
      type: "Assignment",
      deadlineDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 8,
      text: "Midterm Exam",
      description: "Exam covering first half of the course",
      type: "Exam",
      deadlineDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 9,
      text: "Web Development Lab",
      description: "Build responsive website using React",
      type: "Lab",
      deadlineDate: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 10,
      text: "Code Review Assignment",
      description: "Review and provide feedback on peer submissions",
      type: "Assignment",
      deadlineDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      completed: true,
    },
    {
      id: 11,
      text: "Algorithm Lab",
      description: "Implement sorting algorithms",
      type: "Lab",
      deadlineDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 12,
      text: "Project Presentation",
      description: "Present final project to the class",
      type: "Assignment",
      deadlineDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 13,
      text: "Quiz",
      description: "Weekly quiz on recent topics",
      type: "Exam",
      deadlineDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 14,
      text: "System Design Assignment",
      description: "Design scalable architecture for e-commerce platform",
      type: "Assignment",
      deadlineDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 15,
      text: "Network Programming Lab",
      description: "Implement client-server communication",
      type: "Lab",
      deadlineDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      id: 16,
      text: "Portfolio Assignment",
      description: "Create portfolio showcasing all projects",
      type: "Assignment",
      deadlineDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
  ];

  const [todos, setTodos] = useState(initialTodos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 20;

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

function App() {
  const { login } = useAuth();

  const handleLogin = (studentCode, password) => {
    return login(studentCode, password);
  };

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TodoApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

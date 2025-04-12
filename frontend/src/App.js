import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import TodoCountdown from "./components/TodoCountdown";
import Modal from "./components/Modal";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import "./components/Todo.css";
import Register from "./components/Register";

function TodoApp() {
  const todoTypes = ["Lab", "Assignment", "Exam"];
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const ITEMS_PER_PAGE = 20;

  const fetchTodos = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const {data: response} = await axios.get('http://localhost:3000/api/todos',  {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTodos(prevTodos => response.data);
    } catch (error) {
      toast.error('Failed to fetch todos');
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [page, isAuthenticated]);

  const handleAddTodo = async (todo) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/todos', {
        title: todo.text,
        description: todo.description,
        type: todo.type,
        deadlineDate: todo.deadlineDate,
        status: 'pending'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setTodos(prevTodos => [response.data, ...prevTodos]);
      setIsModalOpen(false);
      toast.success('Todo added successfully');
    } catch (error) {
      toast.error('Failed to add todo');
      console.error('Error adding todo:', error);
    }
  };

  const handleToggle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const todo = todos.find(t => t._id === id);
      const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
      
      const response = await axios.patch(`http://localhost:3000/api/todos/${id}`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo._id === id ? response.data : todo
        )
      );
      toast.success('Todo status updated');
    } catch (error) {
      toast.error('Failed to update todo status');
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/todos/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete todo');
      console.error('Error deleting todo:', error);
    }
  };

  const loadMore = useCallback(() => {
    if (!loading && isAuthenticated) {
      setPage(prevPage => prevPage + 1);
    }
  }, [loading, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="app">
      <TodoList
        todos={todos}
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
        <Route path="/register" element={<Register />} />
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

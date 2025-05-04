import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import TodoList from "./components/todo/TodoList";
import TodoForm from "./components/todo/TodoForm";
import TodoCountdown from "./components/todo/TodoCountdown";
import Modal from "./components/common/Modal";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CategoryForm from "./components/category/CategoryForm";
import { useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeSelector from "./components/common/ThemeSelector";
import "./components/todo/Todo.css";
import Register from "./components/auth/Register";
import { useNavigate } from "react-router-dom";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const todoTypes = ["Lab", "Assignment", "Exam"];
  const [student, setStudent] = React.useState({
    firstName: "Nymdorj",
    lastName: "Baasandorj",
    studentCode: "2019000000",
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);

  const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    const { data: response } = await axios.get('http://localhost:3000/api/categories', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    setCategories(response.data);
  }
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setStudent(user);
    fetchCategories();
  }, []);

  React.useEffect(() => {
    fetchTodos();
  }, [activeTab]);

  const fetchTodos = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = activeTab === 'all' ? 'http://localhost:3000/api/todos' : `http://localhost:3000/api/todos?category=${categories.find(cat => cat.name === activeTab)?._id}`;
      const { data: response } = await axios.get(url, {
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
      const currentChosenCategory = categories.find(cat => cat.name === activeTab);
      
      if (todo.id) {
        // Update existing todo
        const response = await axios.patch(`http://localhost:3000/api/todos/${todo.id}`, {
          title: todo.text,
          description: todo.description,
          type: todo.type,
          deadlineDate: todo.deadlineDate,
          category: todo.category || currentChosenCategory?._id
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setTodos(prevTodos =>
          prevTodos.map(t => t._id === todo.id ? response.data : t)
        );
        toast.success('Todo updated successfully');
      } else {
        // Create new todo
        const response = await axios.post('http://localhost:3000/api/todos', {
          title: todo.text,
          description: todo.description,
          type: todo.type,
          deadlineDate: todo.deadlineDate,
          status: 'pending',
          category: todo.category || currentChosenCategory?._id
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setTodos(prevTodos => [response.data, ...prevTodos]);
        toast.success('Todo added successfully');
      }
      
      setIsModalOpen(false);
      setEditingTodo(null);
    } catch (error) {
      toast.error(todo.id ? 'Failed to update todo' : 'Failed to add todo');
      console.error('Error saving todo:', error);
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/categories/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      toast.success('Category deleted successfully');

      // If the deleted category was active, switch to 'all'
      if (activeTab === categories.find(cat => cat._id === categoryId)?.name) {
        setActiveTab('all');
      }
    } catch (error) {
      toast.error('Failed to delete category');
      console.error('Error deleting category:', error);
    }
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const getContrastColor = (hexColor) => {
    // Remove the # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors and white for dark colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  return (
    <div className="app">
      <ThemeSelector />
      <div className="todo_container">
        <div className="todo-header">
          <h1>Сайн уу, {student?.firstName || "Nymdorj"}</h1>
          <button className="logout-button" onClick={handleLogout}>
            Гарах
          </button>
        </div>
        <div className="todo_list">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            {categories.map(type => (
              <div key={type._id} className="tab-container">
                <button
                  className={`tab ${activeTab === type.name ? 'active' : ''}`}
                  onClick={() => setActiveTab(type.name)}
                  style={{ 
                    backgroundColor: type.colorCode,
                    color: getContrastColor(type.colorCode)
                  }}
                >
                  {type.name}
                </button>
                <div className="tab-actions">
                  <button
                    className="edit-corner-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(type);
                    }}
                  >
                    ✎
                  </button>
                  <button
                    className="delete-corner-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this category?')) {
                        handleDeleteCategory(type._id);
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {
              isAuthenticated && (
                <button className="add-category-button" onClick={() => setIsCategoryModalOpen(true)}>+</button>
              )
            }
          </div>
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onLoadMore={loadMore}
            onAddClick={() => setIsModalOpen(true)}
            onEdit={handleEditTodo}
          />
        </div>
      </div>
      <TodoCountdown todos={todos} />
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <TodoForm 
          onSubmit={handleAddTodo} 
          todoTypes={todoTypes} 
          chosenCategory={categories.find(cat => cat.name === activeTab)}
          todo={editingTodo}
        />
      </Modal>
      <Modal isOpen={isCategoryModalOpen} onClose={handleCategoryModalClose}>
        <CategoryForm
          category={editingCategory}
          onSuccess={() => {
            handleCategoryModalClose();
            fetchCategories();
          }}
        />
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
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;

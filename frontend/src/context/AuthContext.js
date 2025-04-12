import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Verify token is still valid with the backend
          try {
            await axios.get('http://localhost:3000/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } catch (error) {
            // If token is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (studentCode, password) => {
    try {
      const {data: response} = await axios.post('http://localhost:3000/api/auth/login', {
        studentCode,
        password
      });

      if (!response) {
        throw new Error(response.message || 'Login failed');
      }
      const {data: userData} = await axios.get('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${response.token}`
        }
      });
      // Store both token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData.data));
      setUser(userData.data);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
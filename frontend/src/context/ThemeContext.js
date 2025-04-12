import React, { createContext, useState, useContext, useEffect } from 'react';

const themes = {
  beigeGreen: {
    name: 'Beige & Green',
    colors: {
      '--primary-color': '#4CAF50',
      '--primary-hover': '#388E3C',
      '--danger-color': '#e74c3c',
      '--danger-hover': '#c0392b',
      '--success-color': '#2ecc71',
      '--text-primary': '#2c3e50',
      '--text-secondary': '#7f8c8d',
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f8f9fa',
      '--border-color': '#e1e8ed',
      '--bg-brown': '#f5f0eb',
    }
  },
  blueWhite: {
    name: 'Blue & White',
    colors: {
      '--primary-color': '#2196F3',
      '--primary-hover': '#1976D2',
      '--danger-color': '#e74c3c',
      '--danger-hover': '#c0392b',
      '--success-color': '#2ecc71',
      '--text-primary': '#2c3e50',
      '--text-secondary': '#7f8c8d',
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f5f5f5',
      '--border-color': '#e0e0e0',
      '--bg-brown': '#f5f5f5',
    }
  },
  darkMode: {
    name: 'Dark Mode',
    colors: {
      '--primary-color': '#1565C0',
      '--primary-hover': '#0D47A1',
      '--danger-color': '#e74c3c',
      '--danger-hover': '#c0392b',
      '--success-color': '#2ecc71',
      '--text-primary': '#ffffff',
      '--text-secondary': '#b0bec5',
      '--bg-primary': '#121212',
      '--bg-secondary': '#1e1e1e',
      '--border-color': '#2d2d2d',
      '--bg-brown': '#1e1e1e',
    }
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('beigeGreen');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('theme', themeName);
      applyTheme(themes[themeName]);
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  useEffect(() => {
    applyTheme(themes[currentTheme]);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeSelector.css';

function ThemeSelector() {
  const { currentTheme, changeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="theme-selector">
      <button 
        className="theme-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: themes[currentTheme].colors['--primary-color'],
          color: themes[currentTheme].colors['--text-primary']
        }}
      >
        {isOpen ? '×' : '🎨'}
      </button>
      {isOpen && (
        <div className="theme-options-container">
          <h3>Theme</h3>
          <div className="theme-options">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                onClick={() => {
                  changeTheme(key);
                  setIsOpen(false);
                }}
                style={{
                  backgroundColor: theme.colors['--primary-color'],
                  color: theme.colors['--text-secondary']
                }}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeSelector; 
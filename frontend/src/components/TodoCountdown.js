import React, { useState, useEffect } from 'react';
import './TodoCountdown.css';

function TodoCountdown({ todos }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = (deadline) => {
    const total = new Date(deadline) - now;
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);
    
    return { total, days, hours, minutes, seconds };
  };

  const todosWithDeadline = todos
    .filter(todo => todo.deadlineDate && todo.status !== 'completed')
    .sort((a, b) => new Date(a.deadlineDate) - new Date(b.deadlineDate));

  return (
    <div className="todo-countdown">
      <h2>Ойрхон дуусах таск</h2>
      <div className="countdown-list">
        {todosWithDeadline.map(todo => {
          const time = getTimeRemaining(todo.deadlineDate);
          const isOverdue = time.total < 0;
          
          return (
            <div key={todo._id} className={`countdown-item ${isOverdue ? 'overdue' : ''}`}>
              <h3>{todo.title}</h3>
              {isOverdue ? (
                <div className="countdown-time overdue">Хугацаа хэтэрсэн!</div>
              ) : (
                <div className="countdown-time">
                  {time.days > 0 && <span>{time.days}d </span>}
                  <span>{String(time.hours).padStart(2, '0')}:</span>
                  <span>{String(time.minutes).padStart(2, '0')}:</span>
                  <span>{String(time.seconds).padStart(2, '0')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TodoCountdown; 
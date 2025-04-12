import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [studentCode, setStudentCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentCode || !password) {
      setError('Бүх талбарыг бөглөнө үү');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onLogin(studentCode, password);
      toast.success('Амжилттай!');
      navigate('/');
    } catch (err) {
      const errorMessage = err.message || 'Нэвтрэхэд алдаа гарлаа';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Нэвтрэх</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentCode">Оюутны код</label>
            <input
              type="text"
              id="studentCode"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              placeholder="Оюутны кодоо оруулна уу"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Нууц үг</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Нууц үгээ оруулна уу"
              disabled={isLoading}
            />
          </div>
          <div className="button-container">
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </button>
            <button className="login-button" onClick={() => navigate('/register')}>Бүртгүүлэх</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 
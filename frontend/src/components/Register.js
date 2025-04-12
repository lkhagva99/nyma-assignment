import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentCode: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (Object.values(formData).some(field => field === '')) {
      setError('Бүх талбарыг бөглөнө үү');
      return;
    }

    // Password matching validation
    if (formData.password !== formData.confirmPassword) {
      setError('Нууц үг таарахгүй байна');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...submitData } = formData; // Remove confirmPassword from submission
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Бүртгүүлэхэд алдаа гарлаа');
      }

      toast.success('Амжилттай бүртгэгдлээ!');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.message || 'Бүртгүүлэхэд алдаа гарлаа';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Бүртгүүлэх</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentCode">Оюутны код</label>
            <input
              type="text"
              id="studentCode"
              name="studentCode"
              value={formData.studentCode}
              onChange={handleChange}
              placeholder="Оюутны кодоо оруулна уу"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Овог</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Овогоо оруулна уу"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstName">Нэр</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Нэрээ оруулна уу"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Нууц үг</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Нууц үгээ оруулна уу"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Нууц үг баталгаажуулах</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Нууц үгээ дахин оруулна уу"
              disabled={isLoading}
            />
          </div>
          <div className="button-container">
            <button type="submit" className="register-button" disabled={isLoading}>
              {isLoading ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}
            </button>
            <button className="register-button" onClick={() => navigate('/login')}>Нэвтрэх</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 
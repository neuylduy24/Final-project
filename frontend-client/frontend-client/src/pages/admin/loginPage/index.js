import { memo, useState } from 'react';
import './style.scss';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTERS } from 'utils/router';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
// đăng nhập 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/sign-in', formData);
      if (response.data.token) { // Assuming the backend returns a token on success
        navigate(ROUTERS.ADMIN.STATISTICS);
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login">
      <div className="login-container">

        <div className="login-left">
          <Link to={ROUTERS.USER.HOME}>
            <img className="footer__about_logo" src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png" alt="Logo" />
          </Link>
          <h2 className="login-title">Chào mừng bạn đến với BookStore!!</h2>
        </div>

        <div className="login-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email" className="login-label">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="password" className="login-label">Mật khẩu:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">Đăng nhập</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default memo(LoginPage);
import { memo, useState } from 'react';
import './style.scss';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTERS } from 'utils/router';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(ROUTERS.ADMIN.STATISTICS);
  };

  return (
    <div className="login">
      <div className="login-container">

        <div className="login-left">
          <Link to={ROUTERS.USER.HOME}>
            <img className="footer__about_logo" src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png" alt="Logo" />
          </Link>
          <h2 className="login-title">Chào mừng bạn đến với BookStore!!!</h2>
        </div>

        <div className="login-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="username" className="login-label">Tên đăng nhập:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập"
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
            <button type="submit" className="login-button">Đăng nhập</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default memo(LoginPage);

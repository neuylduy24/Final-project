import { memo } from 'react';
import './style.scss';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTERS } from 'utils/router';
const LoginPage = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(ROUTERS.ADMIN.ORDERS);
  }
  return (
    <div className="login">
      <div className="login-container">
      <Link to={ROUTERS.USER.HOME}>
        <img className="footer__about_logo" src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png" alt="footer__about_logo" />
      </Link>
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="username" className="login-label">Ten dang nhap:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="login-form-group">
            <label htmlFor="password" className="login-label">Mat khau:</label>
            <input type="password" id="username" name="password" required />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        {/* <p>Don't have an account? <a href="#">Sign up</a></p> */}
      </div>
    </div>
  );
}
export default memo(LoginPage);

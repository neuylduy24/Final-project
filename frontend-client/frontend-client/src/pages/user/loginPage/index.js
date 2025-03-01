import { memo, useState } from 'react';
import './style.scss';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../utils/router';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      const response = await axios.post("http://150.95.105.147:8080/api/auth/sign-in", formData);

      if (response.status === 200 && response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("email", formData.email);

        setMessage({ type: "success", text: "Đăng nhập thành công!" });

        setTimeout(() => navigate(ROUTERS.USER.HOME), 500);
      } else {
        setMessage({ type: "error", text: "Email hoặc mật khẩu không chính xác." });
      }
    } catch (err) {
      console.error(err);

      if (!err.response) {
        setMessage({ type: "error", text: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại server." });
      } else if (err.response.status === 401) {
        setMessage({ type: "error", text: "Email hoặc mật khẩu không đúng." });
      } else {
        setMessage({ type: "error", text: err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-left">
          <Link to={ROUTERS.USER.HOME}>
            <img
              className="footer__about_logo"
              src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png"
              alt="Logo"
            />
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

            <Link to={ROUTERS.USER.REGISTER}>Đăng ký</Link>

            {message.text && (
              <p className={message.type === "success" ? "success-message" : "error-message"}>
                {message.text}
              </p>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);

import { memo, useState } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); 
    setLoading(true);

    try {
        const response = await axios.post("http://localhost:8080/api/auth/sign-in", formData);

        if (response.status === 200 && response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email", formData.email); 

            setSuccess("Đăng nhập thành công!");
            setTimeout(() => {
                navigate(ROUTERS.ADMIN.STATISTICS); 
            }, 500);
        } else {
            setError("Email hoặc mật khẩu không chính xác.");
        }
    } catch (err) {
        if (!err.response) {
            setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại server.");
        } else if (err.response.status === 401) {
            setError("Email hoặc mật khẩu không đúng.");
        } else {
            setError(err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
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
              <label htmlFor="email" className="login-label">
                Email:
              </label>
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
              <label htmlFor="password" className="login-label">
                Mật khẩu:
              </label>
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
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
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

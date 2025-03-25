import { memo, useState } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("https://api.it-ebook.io.vn/api/auth/sign-in", formData);

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", formData.email);

        toast.success("✅ Login successful!", { autoClose: 1000 });

        setTimeout(() => {
          navigate(ROUTERS.ADMIN.STATISTICS);
        }, 2000);
      } else {
        toast.error("❌ Email or password is incorrect!");
      }
    } catch (err) {
      if (!err.response) {
        toast.error("❌ Cannot connect to server!");
      } else if (err.response.status === 401) {
        toast.error("❌ Email or password is incorrect!");
      } else {
        toast.error(err.response?.data?.message || "❌ An error occurred, please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="login-container">
        <div className="login-left">
          <div className="login-left-content">
            <Link to={ROUTERS.USER.HOME}>
              <img
                className="login-logo"
                src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png"
                alt="Logo"
              />
            </Link>
            <h2 className="login-title">Welcome to BookStore</h2>
            <p className="login-subtitle">Sign in to access the admin dashboard</p>
            <div className="login-decoration">
              <img 
                src="https://img.freepik.com/free-vector/book-lovers-concept-illustration_114360-1107.jpg" 
                alt="Books illustration" 
                className="login-illustration" 
              />
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-header">
            <h3>Admin Login</h3>
            <p>Enter your credentials to continue</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <div className="input-container">
                <i className="input-icon">📧</i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="login-form-group">
              <label htmlFor="password" className="login-label">
                Password
              </label>
              <div className="input-container">
                <i className="input-icon">🔒</i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  <span>Logging in...</span>
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);

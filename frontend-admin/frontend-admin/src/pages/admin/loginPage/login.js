import { memo, useState } from "react";
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import logologin from "../../../assets/user/image/hero/logo.png";
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
      const response = await axios.post(
        "https://api.it-ebook.io.vn/api/auth/sign-in",
        formData
      );

      const { token, user } = response.data;
      console.log("User data:", user);
      const roles = user?.roles || [];

      if (response.status === 200 && token && roles.includes("ADMIN")) {
        localStorage.setItem("token", token);
        localStorage.setItem("email", formData.email);
        localStorage.setItem("roles", "ADMIN");

        toast.success("✅ Login successful!", { autoClose: 1000 });

        setTimeout(() => {
          navigate(ROUTERS.ADMIN.STATISTICS);
        }, 2000);
      } else if (!roles.includes("ADMIN")) {
        toast.error("❌ You do not have permission to access the admin page!");
      } else {
        toast.error("❌ Email or password is incorrect!");
      }
    } catch (err) {
      if (!err.response) {
        toast.error("❌ Cannot connect to server!");
      } else if (err.response.status === 401) {
        toast.error("❌ Email or password is incorrect!");
      } else {
        toast.error(
          err.response?.data?.message ||
            "❌ An error occurred, please try again!"
        );
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
          <img src={logologin} alt="Login Illustration" />
        </div>

        <div className="login-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            <div className="login-form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                className="input-email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="login-form-group password-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                className="input-email"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);

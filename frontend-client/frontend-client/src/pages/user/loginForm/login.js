import { memo, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ROUTERS } from "../../../utils/path";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./allform.scss";
import logologin from "../../../assets/user/image/hero/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const savedEmail = localStorage.getItem("email") || "";
  const savedPassword = localStorage.getItem("password") || "";
  const savedRememberMe = localStorage.getItem("rememberMe") === "true";

  const [formData, setFormData] = useState({
    email: savedRememberMe ? savedEmail : "",
    password: savedRememberMe ? savedPassword : "",
  });

  const [rememberMe, setRememberMe] = useState(savedRememberMe);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rememberMe) {
      setFormData({ email: savedEmail, password: savedPassword });
    }
  }, [rememberMe, savedEmail, savedPassword]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.it-ebook.io.vn/api/auth/sign-in",
        formData
      );

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", formData.email);

        if (rememberMe) {
          localStorage.setItem("email", formData.email);
          localStorage.setItem("password", formData.password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          localStorage.removeItem("rememberMe");
        }

        toast.success("Login successful!");
        setTimeout(() => navigate(ROUTERS.USER.HOME), 1500);
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (!err.response) {
        toast.error("Cannot connect to the server. Please check your network.");
      } else if (err.response.status === 401) {
        toast.error("Incorrect email or password.");
      } else {
        toast.error(
          err.response?.data?.message || "An error occurred. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <ToastContainer position="top-right" autoClose={2000} />
        <div className="register-left">
          <img src={logologin} alt="Login Illustration" />
        </div>

        <div className="register-right">
          <form onSubmit={handleSubmit} className="register-form">
            <h2>Sign In</h2>

            <div className="register-form-group">
              <label>Email:</label>
              <input
                className="input-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="register-form-group password-group">
              <label>Password:</label>
              <div className="password-input">
                <input
                  className="input-email"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link
                to={ROUTERS.USER.FORGOTPASSWORD}
                className="forgot-password"
              >
                Forgot password?
              </Link>
            </div>

            {message.text && (
              <p className={`message ${message.type}`}>{message.text}</p>
            )}

            <button
              className="register-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p className="text-center">
              Don't have an account?{" "}
              <Link to={ROUTERS.USER.REGISTER}>Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);

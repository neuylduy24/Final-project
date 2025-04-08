import { memo, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ROUTERS } from "../../../utils/path";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./allform.scss";
import logologin from "../../../assets/user/image/hero/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const savedEmail = localStorage.getItem("email") || "";
  const savedRememberMe = localStorage.getItem("rememberMe") === "true";

  const [formData, setFormData] = useState({
    email: savedRememberMe ? savedEmail : "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(savedRememberMe);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const saveLoginInfo = (email, rememberMe) => {
    localStorage.setItem("email", email);
    localStorage.setItem("rememberMe", rememberMe.toString());
  };
  
  const loginUser = async (data) => {
    try {
      const response = await axios.post(
        "https://api.it-ebook.io.vn/api/auth/sign-in",
        data
      );
  
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
        saveLoginInfo(data.email, rememberMe); // ✅ Luôn lưu email & trạng thái rememberMe
  
        toast.success("Login successful!");
        setTimeout(() => navigate(ROUTERS.USER.CHOOSE), 1500);
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Please enter both email and password!");
      setLoading(false);
      return;
    }

    loginUser(formData);
  };

  return (
    <div className="register">
      <div className="register-container">
        <ToastContainer position="top-right" autoClose={1500} />
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
                ref={emailRef}
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
                <button type="button" className="toggle-password" onClick={toggleShowPassword}>
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
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link to={ROUTERS.USER.FORGOTPASSWORD} className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button className="register-button" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p className="text-center">
              Don't have an account? <Link to={ROUTERS.USER.REGISTER}>Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);

import { memo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ROUTERS } from "../../../utils/path";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./allform.scss";
import logologin from "../../../assets/user/image/hero/logo.png";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate confirmPassword in real-time
    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value !== formData.password ? "Passwords do not match." : "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "Full name is required.";
    if (!formData.email.includes("@"))
      newErrors.email = "Invalid email format.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.it-ebook.io.vn/api/auth/sign-up",
        formData
      );
      if (response.status === 201) {
        toast.success("Registration successful! Redirecting...");
        setTimeout(() => navigate(ROUTERS.USER.LOGINPAGE), 1500);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <ToastContainer position="top-right" autoClose={1500} />
        <div className="register-left">
          <img src={logologin} alt="Register Illustration" />
        </div>
        <div className="register-right">
          <form onSubmit={handleSubmit} className="register-form">
            <h2>Sign Up</h2>
            <div className="register-form-group">
              <label>Username:</label>
              <input
                className="input-email"
                
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
              {errors.username && <p className="error">{errors.username}</p>}
            </div>
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
              {errors.email && <p className="error">{errors.email}</p>}
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
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="register-form-group password-group">
              <label>Confirm Password:</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}
            </div>
            <button
              className="register-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
            <p className="text-center">
              Already have an account?{" "}
              <Link to={ROUTERS.USER.LOGINPAGE}>Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(RegisterPage);

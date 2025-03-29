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
  const savedRememberMe = localStorage.getItem("rememberMe") === "true";

  const [formData, setFormData] = useState({
    email: savedRememberMe ? savedEmail : "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(savedRememberMe);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rememberMe) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, [rememberMe, savedEmail]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Vui lòng nhập email và mật khẩu!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://api.it-ebook.io.vn/api/auth/sign-in",
        formData
      );

      if (response.status === 200 && response.data.token) {
        const { token, email } = response.data; // Nhận email từ response thay vì userId
        const expiresAt = new Date().getTime() + 10 * 24 * 60 * 60 * 1000; // 10 ngày

        // Lưu thông tin đăng nhập (chỉ lưu email)
        localStorage.setItem("token", token);
        localStorage.setItem("email", email); // Lưu email thay vì userId
        localStorage.setItem("expiresAt", expiresAt.toString());

        if (rememberMe) {
          localStorage.setItem("email", formData.email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("rememberMe");
        }

        toast.success("Đăng nhập thành công!");
        setTimeout(() => navigate(ROUTERS.USER.HOME), 1500);
      } else {
        toast.error("Email hoặc mật khẩu không đúng.");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      if (!err.response) {
        toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!");
      } else if (err.response.status === 401) {
        toast.error("Email hoặc mật khẩu không chính xác.");
      } else {
        toast.error(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!");
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
                  onChange={(e) => setRememberMe(e.target.checked)}
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
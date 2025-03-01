import { memo, useState } from "react";
import "./style.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";

const InputField = ({ label, type, name, value, onChange, placeholder, error }) => (
  <div className="register-form-group">
    <label htmlFor={name} className="register-label">{label}:</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className={error ? "input-error" : ""}
    />
    {error && <p className="error-text">{error}</p>}
  </div>
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Họ và tên không được để trống.";
    if (!formData.email.includes("@")) newErrors.email = "Email không hợp lệ.";
    if (formData.password.length < 6) newErrors.password = "Mật khẩu ít nhất 6 ký tự.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mật khẩu không khớp.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://150.95.105.147:8080/api/auth/sign-up", {
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });

      if (response.status === 201) {
        setMessage({ type: "success", text: `Đăng ký thành công! Xin chào ${response.data.username}` });
        setTimeout(() => navigate(ROUTERS.USER.LOGINPAGE), 1000);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setMessage({ type: "error", text: "Email này đã được sử dụng!" });
      } else {
        setMessage({ type: "error", text: "Đăng ký thất bại, vui lòng thử lại." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <div className="register-left">
          <Link to={ROUTERS.USER.HOME}>
            <img
              className="footer__about_logo"
              src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png"
              alt="Logo"
            />
          </Link>
          <h2 className="register-title">Chào mừng bạn đến với BookStore!!</h2>
        </div>

        <div className="register-right">
          <form className="register-form" onSubmit={handleSubmit}>
            <InputField
              label="Họ và tên"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              error={errors.username}
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              error={errors.email}
            />
            <InputField
              label="Mật khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              error={errors.password}
            />
            <InputField
              label="Xác nhận mật khẩu"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              error={errors.confirmPassword}
            />

            <Link to={ROUTERS.USER.LOGINPAGE}>Đã có tài khoản? Đăng nhập</Link>

            {message.text && (
              <p className={message.type === "success" ? "success-message" : "error-message"}>
                {message.text}
              </p>
            )}

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(RegisterPage);

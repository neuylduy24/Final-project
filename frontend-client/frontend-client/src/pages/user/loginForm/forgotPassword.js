import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ROUTERS } from "../../../utils/path";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import "./allform.scss";
import logologin from "../../../assets/user/image/hero/logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.it-ebook.io.vn/api/auth/forgot-password",
        { email }
      );

      if (response.status === 200) {
        toast.success("OTP has been sent to your email");
        setStep(2);
      }
    } catch (err) {
      console.error("Error requesting OTP:", err);
      if (!err.response) {
        toast.error("Cannot connect to the server. Please check your network.");
      } else {
        toast.error(
          err.response?.data?.message || "Error sending OTP. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.it-ebook.io.vn/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      if (response.status === 200) {
        toast.success("Password has been reset successfully");
        setTimeout(() => navigate(ROUTERS.USER.LOGINPAGE), 1500);
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      if (!err.response) {
        toast.error("Cannot connect to the server. Please check your network.");
      } else {
        toast.error(
          err.response?.data?.message ||
            "Error resetting password. Please try again."
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
          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="register-form">
              <h2>Forgot Password</h2>
              <p className="text-center">
                Enter your email address and we'll send you an OTP to reset your
                password.
              </p>
              <div className="register-form-group">
                <label>Email:</label>
                <input
                  className="input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <button
                className="register-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
              <p className="text-center">
                Remember your password?{" "}
                <Link to={ROUTERS.USER.LOGINPAGE}>Sign in</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="register-form">
              <h2>Reset Password</h2>
              <p className="text-center">
                Enter the OTP sent to your email and your new password.
              </p>
              <div className="register-form-group">
                <label>OTP:</label>
                <input
                  className="input-email"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter OTP from your email"
                />
              </div>

              <div className="register-form-group password-group">
                <label>New Password:</label>
                <div className="password-input">
                  <input
                    className="input-email"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
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

              <div className="register-form-group password-group">
                <label>Confirm Password:</label>
                <div className="password-input">
                  <input
                    className="input-email"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <button
                className="register-button"
                type="submit"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <p className="text-center">
                <Link to={ROUTERS.USER.LOGINPAGE}>
                  <IoArrowBackCircleSharp />
                  Back to Login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ForgotPassword);

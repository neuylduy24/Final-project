import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../../component/ProfileUser/SideBar/sideBar";
import "../ProfileUserPage/ProfileUserPage.scss";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPasswordPage = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("❌ Confirmation password does not match!");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      toast.error("❌ The new password cannot be the same as the current password!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "https://api.it-ebook.io.vn/api/auth/change-password",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ " + response.data.message);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ An error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="profile-content">
        <ToastContainer position="top-right" autoClose={1500} />
        <h2>Change Password</h2>
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={handleChange}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="update-btn" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

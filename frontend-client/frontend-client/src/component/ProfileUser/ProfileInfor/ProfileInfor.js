import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ROUTERS } from "../../../utils/path";
import "./profileInfor.scss";
import { toast, ToastContainer } from "react-toastify";

const API_URL = "https://api.it-ebook.io.vn/api/users";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", avatar: "" });
  const [newUsername, setNewUsername] = useState(""); // Trạng thái username mới
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user.username) {
      setNewUsername(user.username); // Đồng bộ newUsername với username hiện tại
    }
  }, [user.username]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        console.log("Token:", token);
        console.log("Email:", email);

        if (!token || !email) {
          toast.error("You need to login to view personal information!");
          return;
        }

        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allUsers = response.data;
        const currentUser = allUsers.find((user) => user.email === email);

        if (currentUser) {
          setUser(currentUser);
        } else {
          console.error("User not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate(ROUTERS.USER.HOME);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({ username: "", email: "", avatar: "" });
    toast.success("Logout successful!", {
      onClose: () => navigate(ROUTERS.USER.HOME),
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in!");
        return;
      }

      if (!user.id) {
        toast.error("User ID not found!");
        return;
      }

      // Giữ nguyên email, chỉ cập nhật username
      const updatedData = {
        username: newUsername,
        email: user.email, // Giữ nguyên email
        roles: user.roles,
      };

      const response = await axios.put(`${API_URL}/${user.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success("Update username successfully!");
        setUser((prevUser) => ({
          ...prevUser,
          username: newUsername, // Cập nhật username mới
        }));
      } else {
        toast.error("Update fail!");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error("Error updating username:!");
    }
  };

  return (
    <div className="profile-info">
      <ToastContainer position="top-right" autoClose={1000} />
      <h2>Profile Information</h2>
      {loading ? (
        <p>Loading...</p>
      ) : user.email ? (
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />

          <label>Email:</label>
          <input type="text" value={user.email} readOnly />
        </div>
      ) : (
        <p>Please login to view information</p>
      )}
      <div className="group-btn">
        <button className="update-btn" onClick={handleSave}>
          Save
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

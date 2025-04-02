import React, { useEffect, useState } from "react";
import "./avt.scss";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/path";
import axios from "axios";
const AvatarUploader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate(ROUTERS.USER.LOGIN);

        const response = await axios.get("https://api.it-ebook.io.vn/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allUsers = response.data;
        const email = localStorage.getItem("email");

        // Tìm người dùng có email khớp với email trong localStorage
        const currentUser = allUsers.find((user) => user.email === email);

        if (currentUser) {
          setUser(currentUser);
        } else {
          console.error("User not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);
  return (
    <div className="avatar-uploader">
      <div className="avatar-img">{user.roles}</div>
      <button className="upload-btn">Upload Avatar</button>
    </div>
  );
};
export default AvatarUploader;

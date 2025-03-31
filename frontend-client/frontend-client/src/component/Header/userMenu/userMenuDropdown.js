import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaBookmark, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { ROUTERS } from "utils/path";
import { toast, ToastContainer } from "react-toastify";

const UserMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", avatar: "" });
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const menuRef = useRef(null);
  let timeoutRef = useRef(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkLoginStatus);
    checkLoginStatus();

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({ username: "", email: "", avatar: "" });
    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập

    toast.success("Logout successful!", {
      onClose: () => navigate(ROUTERS.USER.HOME),
    });
  };

  return (
    <li
      className="user-menu"
      ref={menuRef}
      onMouseEnter={() => {
        clearTimeout(timeoutRef.current);
        setShowMenu(true);
      }}
      onMouseLeave={() => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setShowMenu(false), 300);
      }}
    >
      <ToastContainer position="top-right" autoClose={1000} />

      <button className="btn-user">
        <FaUser />
      </button>

      {showMenu && (
        <ul className="dropdown-menu">
          <li>
            <FaUser /> <Link to={ROUTERS.USER.PROFILE}>Profile</Link>
          </li>
          <li>
            <FaBookmark /> <Link to={ROUTERS.USER.BOOKFOLLOW}>Book Follow</Link>
          </li>
          <li>
            <FaHistory />{" "}
            <Link to={ROUTERS.USER.BOOKHISTORY}>Book History</Link>
          </li>
          <li>
            <FaSignOutAlt />
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </li>
        </ul>
      )}
    </li>
  );
};

export default UserMenu;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaLock, FaHistory, FaBookmark, FaComments} from "react-icons/fa";
import "./sidebar.scss";
import { ROUTERS } from "utils/path";

const Sidebar = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const menuItems = [
    { icon: <FaUser />, label: "Information ", path: ROUTERS.USER.PROFILE },
    { icon: <FaLock />, label: "Reset Password", path: ROUTERS.USER.RESETPASSWORD },
    { icon: <FaHistory />, label: "Book History", path: ROUTERS.USER.BOOKHISTORY },
    { icon: <FaBookmark />, label: "Book Follow", path: ROUTERS.USER.BOOKFOLLOW },
    { icon: <FaComments />, label: "Comment", path: ROUTERS.USER.COMMENT },
  ];

  return (
    <div className="sidebar">
      <div className="menu-list">
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            to={item.path} 
            className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Sidebar;

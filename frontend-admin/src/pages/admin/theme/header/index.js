import { memo, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { ROUTERS } from "../../../../utils/router";
import "./style.scss";
import {
  FaCircleChevronDown,
  FaCircleChevronUp,
  FaUser,
} from "react-icons/fa6";
import axios from "axios";

const HeaderAd = ({ ...props }) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate(ROUTERS.ADMIN.LOGIN);
          return;
        }

        const response = await axios.get(
          "http://150.95.105.147:8080/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsername(response.data.username);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        navigate(ROUTERS.ADMIN.LOGIN);
      }
    };

    fetchUserData();
  }, [navigate]);

  const [navItems, setMenu] = useState([
    { label: "Tổng quan", path: ROUTERS.ADMIN.STATISTICS },
    {
      label: "Quản lý",
      isShowSubmenu: false,
      child: [
        { label: "Quản lý sách", path: ROUTERS.ADMIN.BOOKS },
        { label: "Quản lý thể loại", path: ROUTERS.ADMIN.BOOKSCATEGORIES },
        { label: "Quản lý chương", path: ROUTERS.ADMIN.CHAPTERBOOKS },
        // { label: "Quản lý bookmarks ", path: ROUTERS.ADMIN.BOOKS },
      ],
    },
    { label: "Quản lý người dùng", path: ROUTERS.ADMIN.USERS },
    { label: "Đăng xuất", path: ROUTERS.ADMIN.LOGIN, icon: <IoLogOut /> },
  ]);

  const handleNavClick = (path) => {
    setActivePath(path);
    navigate(path);
  };

  const handleMenuClick = (index) => {
    setMenu((prevMenu) =>
      prevMenu.map((item, i) =>
        i === index ? { ...item, isShowSubmenu: !item.isShowSubmenu } : item
      )
    );
  };

  return (
    <div className="admin_sidebar" {...props}>
      <div className="header_logo">
        <img
          src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png"
          alt="Logo"
        />
      </div>
      <h2 className="admin_sidebar-title">
        <FaUser /> {username || "Admin"}
      </h2>
      <div className="menu_wrapper_navbar">
        <ul>
          {navItems.map((item, index) => (
            <li
              key={index}
              className={`${item.isShowSubmenu ? "show_submenu" : ""} ${
                activePath === item.path ? "active" : ""
              }`}
            >
              {item.child ? (
                <>
                  <div
                    className="admin_sidebar-row"
                    onClick={() => handleMenuClick(index)}
                  >
                    <span className="admin_sidebar-label">{item.label}</span>
                    {item.isShowSubmenu ? (
                      <FaCircleChevronUp />
                    ) : (
                      <FaCircleChevronDown />
                    )}
                  </div>
                  <ul className="header_menu_dropdown">
                    {item.child.map((childItem, childIndex) => (
                      <li
                        key={childIndex}
                        className={activePath === childItem.path ? "active" : ""}
                        onClick={() => handleNavClick(childItem.path)}
                      >
                        <Link to={childItem.path}>{childItem.label}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div
                  className="admin_sidebar-row"
                  onClick={() => handleNavClick(item.path)}
                >
                  <Link to={item.path} className="admin_sidebar-label">
                    {item.label}
                    {item.icon}
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(HeaderAd);

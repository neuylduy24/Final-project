import { memo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { ROUTERS } from "../../../../utils/router";
import "./sidebar.scss";
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
          "https://api.it-ebook.io.vn/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching user information:", error);
        navigate(ROUTERS.ADMIN.LOGIN);
      }
    };

    fetchUserData();
  }, [navigate]);

  const [navItems, setMenu] = useState([
    { label: "Overview", path: ROUTERS.ADMIN.STATISTICS },
    {
      label: "Management",
      isShowSubmenu: false,
      child: [
        { label: "Book Management", path: ROUTERS.ADMIN.BOOKS },
        { label: "Category Management", path: ROUTERS.ADMIN.BOOKSCATEGORIES },
        { label: "Chapter Management", path: ROUTERS.ADMIN.CHAPTERBOOKS },
      ],
    },
    { label: "User Management", path: ROUTERS.ADMIN.USERS },
    { label: "Logout", path: ROUTERS.ADMIN.LOGIN, icon: <IoLogOut /> },
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
          src="/logo.png"
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
                    <span>{item.label}</span>
                    {item.isShowSubmenu ? (
                      <FaCircleChevronUp />
                    ) : (
                      <FaCircleChevronDown />
                    )}
                  </div>
                  <ul className="submenu">
                    {item.child.map((childItem, childIndex) => (
                      <li
                        key={childIndex}
                        className={activePath === childItem.path ? "active" : ""}
                        onClick={() => handleNavClick(childItem.path)}
                      >
                        <span>{childItem.label}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div
                  className="admin_sidebar-row"
                  onClick={() => handleNavClick(item.path)}
                >
                  <span>{item.label}</span>
                  {item.icon}
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

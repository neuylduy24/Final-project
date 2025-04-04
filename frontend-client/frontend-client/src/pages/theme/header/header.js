import { memo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./style.scss";
import {
  FaInstagram,
  FaUser,
  FaListUl,
  FaCircleChevronUp,
  FaCircleChevronDown,
} from "react-icons/fa6";
import { SiFacebook } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import logo from "../../../assets/user/image/hero/logo.png";
import UserMenu from "../../../component/Header/userMenu/userMenuDropdown";
import MenuItem from "component/Header/MenuItem/menuItem";
import SearchBar from "../../../component/Header/SearchBar/searchBar";
import { ROUTERS } from "utils/path";
import ChatboxButton from "component/Action/ChatboxButton/chatboxButton";

const Header = () => {
  const location = useLocation();
  const [isShowMenuWrapper, setShowMenuWrapper] = useState(false);
  const [isHome, setIsHome] = useState(location.pathname.length <= 1);
  const [isShowCategories, setShowCategories] = useState(isHome);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(""); // Thêm state để lưu username
  const API_URL = "https://api.it-ebook.io.vn/api/users";

  const [menu, setMenu] = useState([
    {
      name: "Home",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "BookNew",
      path: ROUTERS.USER.BOOKNEW,
    },
    {
      name: "Categories",
      path: "",
      isShowSubmenu: false,
      child: [],
    },
    {
      name: "Ranking",
      path: "",
      isShowSubmenu: false,
      child: [
        {
          name: "Top day",
          path: ROUTERS.USER.TOPDAY,
        },
        {
          name: "Top week",
          path: ROUTERS.USER.TOPWEEK,
        },
        {
          name: "Top month",
          path: ROUTERS.USER.TOPMONTH,
        },
      ],
    },
    {
      name: "Follow",
      path: ROUTERS.USER.BOOKFOLLOW,
    },
    {
      name: "History",
      path: ROUTERS.USER.BOOKHISTORY,
    },
  ]);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUsername(""); // Xóa username khi đăng xuất
        return;
      }

      try {
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const userData = response.data;
          const userEmail = JSON.parse(atob(token.split(".")[1])).sub;
          const user = userData.find((u) => u.email === userEmail);

          if (user) {
            setUsername(user.username);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Error fetching user data!");
      }
    };

    fetchUser();

    const handleStorageChange = (event) => {
      if (event.key === "token") {
        setIsLoggedIn(!!localStorage.getItem("token"));
        fetchUser(); // Cập nhật lại username khi token thay đổi
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.it-ebook.io.vn/api/categories"
        );
        const categories = response.data.map((category) => ({
          name: category.name,
          path: `${ROUTERS.USER.BOOKLIST}?category=${category.id}`,
        }));

        setMenu((prevMenu) =>
          prevMenu.map((item) =>
            item.name === "Categories" ? { ...item, child: categories } : item
          )
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleMenuClick = (menuKey) => {
    setMenu((prevMenu) => {
      const newMenu = [...prevMenu];
      if (newMenu[menuKey]?.child) {
        newMenu[menuKey].isShowSubmenu = !newMenu[menuKey].isShowSubmenu;
      }
      return newMenu;
    });
  };
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
  useEffect(() => {
    const isHome = location.pathname.length <= 1;
    setIsHome(isHome);
    setShowCategories(isHome);
  }, [location]);

  return (
    <>
      <div
        className={`menu_wrapper_overlay ${isShowMenuWrapper ? "active" : ""}`}
        onClick={() => setShowMenuWrapper(false)}
      />
      <div className="chat-box">
      <ChatboxButton/>
      </div>
      <div className={`menu_wrapper ${isShowMenuWrapper ? "show" : ""}`}>
        <div className="header_logo">
          <Link to={ROUTERS.USER.HOME}>
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="menu_wrapper_widget">
          <div className="header_top_right_auth">
            <Link to={ROUTERS.USER.LOGINPAGE}>
              <FaUser /> Login
            </Link>
          </div>
        </div>
        <div className="menu_wrapper_navbar">
          <ul>
            {menu.map((menu, menuKey) => (
              <li key={menu.name || menuKey}>
                <Link
                  to={menu.path}
                  onClick={() => {
                    handleMenuClick(menuKey);
                  }}
                >
                  {menu.name}{" "}
                  {menu.child &&
                    (menu.isShowSubmenu ? (
                      <FaCircleChevronDown />
                    ) : (
                      <FaCircleChevronUp />
                    ))}
                </Link>
                {menu.child && menu.isShowSubmenu && (
                  <ul
                    className={`header_menu_doppdown ${
                      menu.isShowSubmenu ? "show_submenu" : ""
                    }`}
                  >
                    {menu.child.map((childItem, childKey) => (
                      <li key={childItem.name || `&{menu}-${childKey}`}>
                        <Link to={childItem.path}>{childItem.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="header_top_right_social">
          <Link to={""}>
            <SiFacebook />
          </Link>
          <Link to={""}>
            <FaInstagram />
          </Link>
        </div>
        <div className="menu_wrapper_contact">
          <ul>
            <li>
              <MdEmail />
              {isLoggedIn
                ? `Hello, ${username}`
                : "Hello, welcome to BOOKSTORE"}
            </li>
            <li>Free reading book!!</li>
          </ul>
        </div>
      </div>

      <div className="header_top">
        <div className="container">
          <div className="row">
            <div className="col-6 header_top_left">
              <ul>
                <Link to={ROUTERS.USER.HOME}>
                  <img width="60px" src={logo} alt="Logo" />
                </Link>
                <li>
                  {isLoggedIn
                    ? `Hello, ${username}`
                    : "Hello, welcome to BOOKSTORE"}
                </li>
              </ul>
            </div>
            <div className="col-6 header_top_right">
              <ul className="auth-links">
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link to={""}>
                        <SiFacebook />
                      </Link>
                    </li>
                    <li>
                      <Link to={""}>
                        <FaInstagram />
                      </Link>
                    </li>
                    <UserMenu onLogout={() => setIsLoggedIn(false)} />
                  </>
                ) : (
                  <li className="user-auth">
                    <Link to={ROUTERS.USER.REGISTER}>Sign Up</Link>
                    <span>|</span>
                    <Link to={ROUTERS.USER.LOGINPAGE}>Sign In</Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="header_logo"></div>
          </div>
          <div className="col-lg-6">
            <nav className="header_menu">
              <MenuItem menu={menu} />
            </nav>
          </div>
          <div className="col-lg-3">
            <div className="menu_open">
              <FaListUl onClick={() => setShowMenuWrapper(true)} />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row hero_categories_container">
          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 hero_categories">
            <div
              className="hero_categories_all"
              onClick={() => setShowCategories(!isShowCategories)}
            >
              <FaListUl />
              Ranking
            </div>
            {isShowCategories && (
              <ul>
                {menu
                  .find((item) => item.name === "Ranking")
                  ?.child.map((rankingItem, key) => (
                    <li key={key}>
                      <Link to={rankingItem.path}>{rankingItem.name}</Link>
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <SearchBar />
        </div>
      </div>
    </>
  );
};

export default memo(Header);

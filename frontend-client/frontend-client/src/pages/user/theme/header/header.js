import { memo, useEffect, useState } from "react";
import "./style.scss";
import {
  FaInstagram,
  FaUser,
  FaListUl,
  FaCircleChevronUp,
  FaCircleChevronDown,
  FaCommentDots,
  FaBookmark,
} from "react-icons/fa6";
import { SiFacebook } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { ROUTERS } from "utils/path";
import { FaHistory, FaSignOutAlt } from "react-icons/fa";
import SearchBar from "component/SearchBar/searchBar";
import logo from "../../../../assets/user/image/hero/logo.png";
import axios from "axios";

const Header = () => {
  const location = useLocation();
  const [isShowMenuWrapper, setShowMenuWrapper] = useState(false);
  const [isHome, setIsHome] = useState(location.pathname.length <= 1);
  const [isShowCategories, setShowCategories] = useState(isHome);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showMenu, setShowMenu] = useState(false);

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
          path: "Top day",
        },
        {
          name: "Top week",
          path: "Top week",
        },
        {
          name: "Top month",
          path: "Top month",
        },
        {
          name: "Update new",
          path: "Update new",
        },
      ],
    },
    {
      name: "Follow",
      path: ROUTERS.USER.BOOKHISTORY,
    },
    {
      name: "History",
      path: ROUTERS.USER.BOOKHISTORY,
    },
  ]);
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

    // Kiểm tra trạng thái đăng nhập mỗi khi location thay đổi
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
      <button className="chatbox-button">
        <FaCommentDots />
      </button>

      <div className={`menu_wrapper ${isShowMenuWrapper ? "show" : ""}`}>
        <div className="header_logo">
          <Link to={ROUTERS.USER.HOME}>
            <img
              width="250px"
              src={logo}
              alt="Logo"
            />
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
              trongnnbh00676@gmail.com
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
                  <img
                    width="60px"
                    src= {logo}
                    alt="Logo"
                  />
                </Link>
                <li>Hello welcome to BOOKSTORE</li>
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
                    <li className="user-menu">
                      <button onClick={() => setShowMenu(!showMenu)}>
                        <FaUser />
                      </button>
                      {showMenu && (
                        <ul className="dropdown-menu">
                          <li>
                            <FaUser />{" "}
                            <Link to={ROUTERS.USER.PROFILE}>Trang cá nhân</Link>
                          </li>
                          <li>
                            <FaBookmark />{" "}
                            <Link to={ROUTERS.USER.BOOKFOLLOW}>
                              Danh sách theo dõi
                            </Link>
                          </li>
                          <li>
                            <FaHistory />{" "}
                            <Link to={ROUTERS.USER.BOOKHISTORY}>
                              Lịch sử đọc truyện
                            </Link>
                          </li>
                          <li>
                            <FaSignOutAlt />{" "}
                            <Link
                              onClick={() => {
                                localStorage.removeItem("token");
                                setIsLoggedIn(false);
                                setShowMenu(false);
                              }}
                            >
                              Đăng xuất
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  </>
                ) : (
                  <li className="user-auth">
                    <Link to={ROUTERS.USER.REGISTER}>Đăng Ký</Link>
                    <span>|</span>
                    <Link to={ROUTERS.USER.LOGINPAGE}>Đăng Nhập</Link>
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
              <ul>
                {menu.map((menuItem, menuKey) => (
                  <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
                    <Link to={menuItem?.path}>{menuItem?.name}</Link>
                    {menuItem.child && (
                      <ul className="header_menu_dropdown">
                        {menuItem.child.map((childItem, childKey) => (
                          <li key={`${menuKey}-${childKey}`}>
                            <Link to={childItem.path}>{childItem.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
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

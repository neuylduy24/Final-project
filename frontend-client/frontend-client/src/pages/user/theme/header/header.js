import { memo, useEffect, useState } from "react";
import "./style.scss";
import {
  FaInstagram,
  FaUser,
  FaListUl,
  FaPhone,
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

export const categories = [
  "Comic",
  "Science Books",
  "Romance Books",
  "Political Books",
  "Technology Books",
];

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
      child: [
        "Action",
        "Adventure",
        "Anime",
        "Cổ Đại",
        "Comedy",
        "Comic",
        "Detective",
        "Doujinshi",
        "Drama",
        "Fantasy",
        "Gender Bender",
        "Historical",
        "Horror",
        "Isekai",
        "Josei",
        "Magic",
        "Manga",
        "Manhua",
        "Manhwa",
        "Martial Arts",
        "Mystery",
        "Ngôn Tình",
        "One shot",
        "Psychological",
      ].map((name) => ({ name, path: "" })),
    },
    {
      name: "Ranking",
      path: "",
      isShowSubmenu: false,
      child: [
        {
          name: "Top day",
          path: "",
        },
        {
          name: "Top week",
          path: "",
        },
        {
          name: "Top month",
          path: "",
        },
        {
          name: "Update new",
          path: "",
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

    window.addEventListener("storage", checkLoginStatus); // Lắng nghe thay đổi từ localStorage

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

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
              src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png"
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
                    width="100px"
                    src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png"
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
                            <Link to={ROUTERS.USER.BOOKFOLLOW}>Danh sách theo dõi</Link>
                          </li>
                          <li>
                            <FaHistory />{" "}
                            <Link to={ROUTERS.USER.BOOKHISTORY}>Lịch sử đọc truyện</Link>
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
                {menu?.map((menu, menuKey) => (
                  <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
                    <Link to={menu?.path}>{menu?.name}</Link>
                    {menu.child && (
                      <ul className="header_menu_dropdown">
                        {menu.child.map((childItem, childKey) => (
                          <li key={`${menuKey} - ${childKey}`}>
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
              List Books
            </div>
            {isShowCategories && (
              <ul>
                {categories.map((category, key) => (
                  <li key={key}>
                    <Link to={ROUTERS.USER.BOOKLIST}>{category}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-lg-9 col-sm-12 col-xs-12 col-md-12 hero-search-container">
            <div className="hero-search">
              <div className="hero-search-form">
                <form>
                  <input
                    type="text"
                    placeholder="What are you looking for????"
                  />
                  <button type="submit" className="site-btn">
                    Search
                  </button>
                </form>
              </div>
              <div className="hero-search-phone">
                <div className="hero-search-phone-icon">
                  <FaPhone />
                </div>
                <div className="hero-search-phone-text">
                  <p>0987.654.321</p>
                  <span>Hotline 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(Header);

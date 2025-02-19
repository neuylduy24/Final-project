import { memo, useEffect, useState } from 'react';
import "./style.scss";
import { FaInstagram, FaUser, FaCartShopping, FaListUl, FaPhone, FaFacebookF, FaCircleChevronUp, FaCircleChevronDown } from "react-icons/fa6";
import { SiFacebook } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import { formater } from 'utils/fomater';
import { ROUTERS } from 'utils/router';


export const categories = [
  "Truyện Tranh",
  "Sách Khoa Học",
  "Sách Tình Cảm",
  "Sách Chính Trị",
  "Sách Công Nghệ",
]

const Header = () => {
  const location = useLocation();
  const [isShowMenuWrapper, setShowMenuWrapper] = useState(false);
  const [isHome, setIsHome] = useState(location.pathname.length <= 1);
  const [isShowCategories, setShowCategories] = useState(isHome);
  const [menu, setMenu] = useState([
    {
      name: "Trang Chủ",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Sách Mới",
      path: ROUTERS.USER.BOOKNEW,
    },
    {
      name: "Thể Loại",
      path: "",
      isShowSubmenu: false,
      child: [
        {
          name: "Lịch Sử - Chính Trị",
          path: ROUTERS.USER.BOOKNEW,
        },
        {
          name: "Triết Học - Tâm Linh",
          path: "",
        },
        {
          name: "Văn Học - Nghệ Thuật",
          path: "",
        },
        {
          name: "Kinh Tế - Kinh Doanh",
          path: "",
        },
        {
          name: "Khoa Học - Công Nghệ",
          path: "",
        },
      ],
    },
    {
      name: "Sách Bán Chạy",
      path: ROUTERS.USER.BOOKRANK,
    },
    {
      name: "Lịch Sử",
      path: ROUTERS.USER.BOOKHISTORY,
    },
    {
      name: "Liên Hệ",
      path: ROUTERS.USER.BOOKHOTLINE,
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

  useEffect(() =>{
    const isHome = location.pathname.length <= 1;
    setIsHome(isHome);
    setShowCategories(isHome);

  }, [location])
  return (
    <>

      <div className={`menu_wrapper_overlay ${isShowMenuWrapper ? "active" : ""}`}

        onClick={() => setShowMenuWrapper(false)}
      />

      <div className={`menu_wrapper ${isShowMenuWrapper ? "show" : ""}`}>
        <div className="header_logo">
        <Link to={ROUTERS.USER.HOME}>
                <img src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png" alt="Logo" />
              </Link>
        </div>
        <div className="menu_wrapper_cart">
          <ul>
            <li>
              <Link to={""}>
                <FaCartShopping /> <span>1</span>
              </Link>
            </li>
          </ul>
          <div className="header_cart_price">
            Giỏ hàng:  <span>{formater(1900000)}</span>
          </div>
        </div>
        <div className="menu_wrapper_widget">
          <div className="header_top_right_auth">
            <Link to={""}>
              <FaUser /> Đăng Nhập
            </Link>
          </div>
        </div>
        <div className="menu_wrapper_navbar">
          <ul>
            {menu.map((menu, menuKey) => (
              <li key={menu.name || menuKey} >
                <Link to={menu.path} onClick={() => { handleMenuClick(menuKey) }}>
                  {menu.name} {menu.child && (menu.isShowSubmenu ? <FaCircleChevronDown /> : <FaCircleChevronUp />)}
                </Link>
                {menu.child && menu.isShowSubmenu && (
                  <ul className={`header_menu_doppdown ${menu.isShowSubmenu ? "show_submenu" : ""}`}>
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
              <MdEmail />trongnnbh00676@gmail.com
            </li>
            <li>
              Miễn phí đọc sách và truyện thả ga
            </li>
          </ul>
        </div>
      </div>


      <div className="header_top">
        <div className="container">
          <div className="row">
            <div className="col-6 header_top_left">
              <ul>
                <li><MdEmail />trongnnbh00676@gmail.com</li>
                <li>CHÀO MỪNG BẠN ĐẾN BOOKSTORE</li>
              </ul>
            </div>
            <div className="col-6 header_top_right">
              <ul>
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
                <li>
<<<<<<< Updated upstream
                  <Link to="/login">
=======
                  <Link to={ROUTERS.ADMIN.LOGIN}>
>>>>>>> Stashed changes
                    <FaUser />
                  </Link>
                  <span>Đăng Nhập</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="header_logo">
              <Link to={ROUTERS.USER.HOME}>
                <img src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png" alt="Logo" />
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <nav className="header_menu">
              <ul>
                {
                  menu?.map((menu, menuKey) => (
                    <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
                      <Link to={menu?.path}>{menu?.name}</Link>
                      {
                        menu.child && (
                          <ul className="header_menu_dropdown">
                            {
                              menu.child.map((childItem, childKey) => (
                                <li key={`${menuKey} - ${childKey}`}>
                                  <Link to={childItem.path}>{childItem.name}</Link>
                                </li>
                              ))
                            }
                          </ul>
                        )
                      }
                    </li>
                  ))
                }
              </ul>
            </nav>
          </div>
          <div className="col-lg-3">
            <div className="header_cart">
              <div className="header_cart_price">
                <span>{formater(10000)}</span>
              </div>
              <ul>
                <li>
                  <Link to={"#"}>
                    <FaCartShopping /> <span>5</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="menu_open">
              <FaListUl onClick={() => setShowMenuWrapper(true)} />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row hero_categories_container">
          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 hero_categories">
            <div className="hero_categories_all" onClick={() => setShowCategories(!isShowCategories)}>
              <FaListUl />Danh sách sản phẩm</div>
            <ul className={isShowCategories ? "" : "hidden"}>
              {categories.map((category, key) => (
                <li key={key}>
                  <Link to={ROUTERS.USER.BOOKLIST}>{category}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-9 col-sm-12 col-xs-12 col-md-12 hero-search-container">
            <div className="hero-search">
              <div className="hero-search-form">
                <form>
                  <input type="text" placeholder="Bạn đang tìm gì ???" />
                  <button type="submit" className="site-btn">Tìm Kiếm</button>
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
            {isHome && (
              <div className="hero-item">
                <div className="hero-text">
                  <h2>Thư viện<br />đa dạng sách</h2>
                  <p>Miễn phí mọi loại sách</p>
                  <Link to="#" className="primary-btn">Mua Ngay</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default memo(Header);

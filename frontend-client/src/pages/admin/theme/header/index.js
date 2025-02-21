import { memo, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoLogOut } from "react-icons/io5";
import { ROUTERS } from 'utils/router';
import './style.scss';
import { FaCircleChevronDown, FaCircleChevronUp, FaListUl } from 'react-icons/fa6';

const HeaderAd = ({ ...props }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const [navItems, setMenu] = useState([
        { label: 'Tổng quan', path: ROUTERS.ADMIN.STATISTICS },

        {
            label: 'Quản lý sách',
            isShowSubmenu: false,
            child: [
                { label: 'Thêm sách', path: ROUTERS.ADMIN.USERS },
                { label: 'Danh sách sách', path: ROUTERS.ADMIN.BOOKS },
            ],
        },

        { label: 'Quản lý người dùng', path: ROUTERS.ADMIN.USERS },
        { label: 'Đăng xuất', path: ROUTERS.ADMIN.LOGIN, icon: <IoLogOut /> },
    ]);

    const handleNavClick = (path) => {
        navigate(path);
        if (window.innerWidth <= 768) {
            setIsOpen(false);
        }
    };

    const handleMenuClick = (index) => {
        setMenu((prevMenu) => 
            prevMenu.map((item, i) =>
                i === index ? { ...item, isShowSubmenu: !item.isShowSubmenu } : item
            )
        );
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <>
            {!isOpen && (
                <div className="menu-toggle" onClick={() => setIsOpen(true)}>
                    <FaListUl />
                </div>
            )}
            <div ref={sidebarRef} className={`admin_sidebar ${isOpen ? 'open' : ''}`} {...props}>
                <div className="header_logo">
                    <img src="https://ezequiel-santalla.github.io/bookstore/img/logo/logo.png" alt="Logo" />
                </div>
                <h2 className="admin_sidebar-title">Tên đăng nhập</h2>
                <div className="menu_wrapper_navbar">
                    <ul>
                        {navItems.map((item, index) => (
                            <li key={index} className={item.isShowSubmenu ? "show_submenu" : ""}>
                                {item.child ? (
                                    <>
                                        <div className="admin_sidebar-row" onClick={() => handleMenuClick(index)}>
                                            <span className="admin_sidebar-label">{item.label}</span>
                                            {item.isShowSubmenu ? <FaCircleChevronUp /> : <FaCircleChevronDown />}
                                        </div>
                                        <ul className="header_menu_dropdown">
                                            {item.child.map((childItem, childIndex) => (
                                                <li key={childIndex} onClick={() => handleNavClick(childItem.path)}>
                                                    <Link to={childItem.path}>{childItem.label}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <div className="admin_sidebar-row" onClick={() => handleNavClick(item.path)}>
                                        <Link to={item.path} className="admin_sidebar-label">
                                            {item.label}
                                        </Link>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default memo(HeaderAd);

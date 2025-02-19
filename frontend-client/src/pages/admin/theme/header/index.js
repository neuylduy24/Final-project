import { memo } from 'react';
import './style.scss';
import { ROUTERS } from 'utils/router';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCartShopping } from 'react-icons/fa6';
import { IoLogOut } from "react-icons/io5";
const HeaderAd = ({ children, ...props }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const navItems = [
        {
            path: ROUTERS.ADMIN.ORDERS,
            onclick: () => navigate(ROUTERS.ADMIN.ORDERS),
            label: 'Đơn hàng',
            icon: <FaCartShopping />
        },
        {
            path: ROUTERS.ADMIN.LOGOUT,
            onclick: () => navigate(ROUTERS.ADMIN.LOGIN),
            label: 'Đăng xuất',
            icon: <IoLogOut  />
        },

    ]
    return (
        <div className="admin_header container" {...props}>
            <nav className="admin_header_nav">
                {navItems.map(({ path, onclick, label, icon }) => (
                    <div key={path} className={`admin_header_nav-item ${location.pathname.includes(path) ? "admin_header_nav-item--active" : ""}`}
                    onClick={onclick}
                    >
                        <span className="admin_header_nav-icon">{icon}</span>
                        <span>{label}</span>
                    </div>))}
            </nav>
        </div>
    );
}
export default memo(HeaderAd);

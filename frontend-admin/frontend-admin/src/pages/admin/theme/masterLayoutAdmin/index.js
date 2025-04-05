import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../header';
import { ROUTERS } from '../../../../utils/router';
import './style.scss';

const MasterLayoutAdmin = ({ children, ...props }) => {
    const location = useLocation();
    const isLoginPage = location.pathname.startsWith(ROUTERS.ADMIN.LOGIN);

    return (
        <div className="admin_layout" {...props}>
            {!isLoginPage && (
                <Header />
            )}
            <div className="admin_content">{children}</div>
        </div>
    );
};

export default memo(MasterLayoutAdmin);

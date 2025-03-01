import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Header from '../header';
import Footer from '../footer';
import { ROUTERS } from 'utils/router';

const MasterLayoutUser = ({ children }) => {
    const location = useLocation();
    const isLoginPage = location.pathname.startsWith(ROUTERS.USER.LOGINPAGE);

    const isAuthenticated = localStorage.getItem('token'); 

    if (!isAuthenticated && !isLoginPage) {
        return <Navigate to={ROUTERS.USER.LOGINPAGE} replace />;
    }

    return (
        <div>
            {!isLoginPage && <Header />}
            {children}
            {!isLoginPage && <Footer />}
        </div>
    );
}

export default MasterLayoutUser;

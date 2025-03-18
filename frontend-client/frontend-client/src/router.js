import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ROUTERS, USER_PATH } from "./utils/router";

import MasterLayout from "./pages/user/theme/masterLayout";
import HomePage from "./pages/user/homePage";
import BookDetailProductPage from "./pages/user/BookDetailProductPage";
import ShoppingCartPage from "./pages/user/shoppingCartPage";
import CheckoutPage from "./pages/user/checkoutPage";
import LoginPage from "./pages/user/loginPage";
import RegisterPage from "./pages/user/registerPage";

const RouterCustom = () => {
    const location = useLocation();
    const isRegisterPage = location.pathname === ROUTERS.USER.REGISTER;
    const isUserRouters = location.pathname.startsWith(USER_PATH);

    if (!isUserRouters) {
        return <Navigate to={ROUTERS.USER.LOGINPAGE} replace />;
    }

    return (
        <Routes>
            {isRegisterPage ? (
                <Route path={ROUTERS.USER.REGISTER} element={<RegisterPage />} />
            ) : (
                <Route
                    path="*"
                    element={
                        <MasterLayout>
                            <Routes>
                                <Route path="/" element={<Navigate to={ROUTERS.USER.LOGINPAGE} replace />} />
                                <Route path={ROUTERS.USER.LOGINPAGE} element={<LoginPage />} />
                                <Route path={ROUTERS.USER.REGISTER} element={<RegisterPage />} />
                                <Route path={ROUTERS.USER.HOME} element={<HomePage />} />
                                <Route path={ROUTERS.USER.BOOKDETAIL} element={<BookDetailProductPage />} />
                                <Route path={ROUTERS.USER.BOOKCARTSHOPPING} element={<ShoppingCartPage />} />
                                <Route path={ROUTERS.USER.CHECKOUT} element={<CheckoutPage />} />
                            </Routes>
                        </MasterLayout>
                    }
                />
            )}
        </Routes>
    );
};

export default RouterCustom;

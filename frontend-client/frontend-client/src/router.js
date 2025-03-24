import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ROUTERS, USER_PATH } from "./utils/path";

import MasterLayout from "./pages/user/theme/masterLayout/masterLayout";
import HomePage from "./pages/user/homePage/homepage";
import BookDetailProductPage from "./pages/user/BookDetailProductPage/bookDetail";
import LoginPage from "./pages/user/loginForm/login";
import RegisterPage from "./pages/user/loginForm/register";
import ChapterDetailPage from "component/ChapterDetail/ChapterDetailPage";
import ForgotPasswordPage from "pages/user/loginForm/forgotPassword";

const RouterCustom = () => {
    const location = useLocation();
    const isUserRoute = location.pathname.startsWith(USER_PATH);

    if (!isUserRoute) {
        return <Navigate to={ROUTERS.USER.HOME} replace />;
    }

    return (
        <Routes>
            <Route path={ROUTERS.USER.LOGINPAGE} element={<LoginPage />} />
            <Route path={ROUTERS.USER.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTERS.USER.FORGOTPASSWORD} element={<ForgotPasswordPage />} />

            <Route
                path="*"
                element={
                    <MasterLayout>
                        <Routes>
                            <Route path={ROUTERS.USER.HOME} element={<HomePage />} />
                            <Route path={ROUTERS.USER.BOOKDETAIL} element={<BookDetailProductPage />} />
                            <Route path={ROUTERS.USER.CHAPTERDETAIL} element={<ChapterDetailPage />} />
                        </Routes>
                    </MasterLayout>
                }
            />
        </Routes>
    );
};

export default RouterCustom;

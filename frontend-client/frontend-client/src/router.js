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
import FollowedBooksPage from "pages/user/FollowedBooksPage/FollowedBooks"; // Trang danh sách truyện theo dõi

const RouterCustom = () => {
    const location = useLocation();
    const isUserRoute = location.pathname.startsWith(USER_PATH);

    if (!isUserRoute) {
        return <Navigate to={ROUTERS.USER.HOME} replace />;
    }

    return (
        <Routes>
            {/* Các trang đăng nhập, đăng ký */}
            <Route path={ROUTERS.USER.LOGINPAGE} element={<LoginPage />} />
            <Route path={ROUTERS.USER.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTERS.USER.FORGOTPASSWORD} element={<ForgotPasswordPage />} />

            {/* Gói trang user trong MasterLayout để giữ Header và Footer cố định */}
            <Route
                path="*"
                element={
                    <MasterLayout>
                        <Routes>
                            <Route path={ROUTERS.USER.HOME} element={<HomePage />} />
                            <Route path={ROUTERS.USER.BOOKDETAIL} element={<BookDetailProductPage />} />
                            <Route path={ROUTERS.USER.CHAPTERDETAIL} element={<ChapterDetailPage />} />
                            <Route path={ROUTERS.USER.BOOKFOLLOW} element={<FollowedBooksPage />} /> {/* Trang danh sách truyện theo dõi */}
                        </Routes>
                    </MasterLayout>
                }
            />
        </Routes>
    );
};

export default RouterCustom;

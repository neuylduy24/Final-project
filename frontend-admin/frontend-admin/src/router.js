import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ADMIN_PATH, ROUTERS } from "./utils/router";

import LoginPage from "./pages/admin/loginPage";
import MasterLayoutAdmin from "./pages/admin/theme/masterLayoutAdmin";
import CategoriesManagementAdPage from "./pages/admin/categoriesManagementPage";
import ChapterManagementPage from "./pages/admin/chapterManagementPage";
import UserManagementAdPage from "./pages/admin/userManagementPage";
import StatisticManagementPage from "./pages/admin/statisticManagementPage";

// ✅ Kiểm tra trạng thái đăng nhập
const isAuthenticated = () => !!localStorage.getItem("token");

// ✅ Danh sách route của Admin
const adminRoutes = [
    { path: ROUTERS.ADMIN.STATISTICS, component: <StatisticManagementPage /> },
    { path: ROUTERS.ADMIN.BOOKSCATEGORIES, component: <CategoriesManagementAdPage /> },
    { path: ROUTERS.ADMIN.CHAPTERBOOKS, component: <ChapterManagementPage /> },
    { path: ROUTERS.ADMIN.USERS, component: <UserManagementAdPage /> },
];

// ✅ Admin Router (Chặn truy cập nếu chưa đăng nhập)
const AdminRouter = () => {
    if (!isAuthenticated()) {
        return <Navigate to={ROUTERS.ADMIN.LOGIN} replace />;
    }

    return (
        <MasterLayoutAdmin>
            <Routes>
                <Route path="/" element={<Navigate to={ROUTERS.ADMIN.STATISTICS} replace />} />
                {adminRoutes.map((item, index) => (
                    <Route key={index} path={item.path} element={item.component} />
                ))}
                <Route path="*" element={<Navigate to={ROUTERS.ADMIN.STATISTICS} replace />} />
            </Routes>
        </MasterLayoutAdmin>
    );
};

// ✅ Kiểm tra URL và render router đúng
const RouterCustom = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith(ADMIN_PATH);

    return (
        <Routes>
            <Route path={ROUTERS.ADMIN.LOGIN} element={<LoginPage />} />
            {isAdminRoute ? (
                <Route path="/*" element={<AdminRouter />} />
            ) : (
                <Route path="*" element={<Navigate to={ROUTERS.ADMIN.LOGIN} replace />} />
            )}
        </Routes>
    );
};

export default RouterCustom;

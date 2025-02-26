import React from "react";
import { ADMIN_PATH, ROUTERS } from "./utils/router";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import LoginPage from "./pages/admin/loginPage";
import MasterLayoutAdmin from "./pages/admin/theme/masterLayoutAdmin";
import CategoriesManagementAdPage from "./pages/admin/categoriesManagementPage";
import ChapterManagementPage from "./pages/admin/chapterManagementPage";
import UserManagementAdPage from "./pages/admin/userManagementAdPage";
import StatisticManagementPage from "./pages/admin/statisticManagementPage";

const renderAdminRouter = () => {
    const adminRouters = [
        {
            path: ROUTERS.ADMIN.LOGIN,
            component: <LoginPage />,
        },
        {
            path: ROUTERS.ADMIN.STATISTICS,
            component: <StatisticManagementPage />,
        },
        {
            path: ROUTERS.ADMIN.BOOKSCATEGORIES,
            component: <CategoriesManagementAdPage />,
        },
        {
            path: ROUTERS.ADMIN.CHAPTERBOOKS,
            component: <ChapterManagementPage />,
        },
        {
            path: ROUTERS.ADMIN.USERS,
            component: <UserManagementAdPage />,
        },
    ];

    return (
        <MasterLayoutAdmin>
            <Routes>
                {/* Chuyển hướng mặc định về Login nếu không khớp với route nào */}
                <Route path="/" element={<Navigate to={ROUTERS.ADMIN.LOGIN} replace />} />
                {adminRouters.map((item, key) => (
                    <Route key={key} path={item.path} element={item.component} />
                ))}
            </Routes>
        </MasterLayoutAdmin>
    );
};

const RouterCustom = () => {
    const location = useLocation();
    const isAdminRouters = location.pathname.startsWith(ADMIN_PATH);

    return isAdminRouters ? renderAdminRouter() : <Navigate to={ROUTERS.ADMIN.LOGIN} replace />;
};

export default RouterCustom;

import React from "react";
import { ADMIN_PATH, ROUTERS } from "./utils/router";
import HomePage from "./pages/user/homePage";
import { Routes, Route, useLocation } from "react-router-dom";
import MasterLayout from "./pages/user/theme/masterLayout";
import BookListProductPage from "./pages/user/bookListProductPage";
import BookDetailProductPage from "./pages/user/BookDetailProductPage";
import ShoppingCartPage from "pages/user/shoppingCartPage";
import CheckoutPage from "pages/user/checkoutPage";
import LoginPage from "pages/admin/loginPage";
import MasterLayoutAdmin from "pages/admin/theme/masterLayoutAdmin";
import BookManagementAdPage from "pages/admin/bookManagementAdPage";
import UserManagementAdPage from "pages/admin/userManagementAdPage";
import StatisticManagementPage from "pages/admin/statisticManagementPage";

const renderUserRouter = () => {
    const userRouters = [
        {
            path: ROUTERS.USER.HOME,
            component: <HomePage />,
        },
        {
            path: ROUTERS.USER.BOOKLIST,
            component: <BookListProductPage />,
        },
        {
            path: ROUTERS.USER.BOOKDETAIL,
            component: <BookDetailProductPage />,
        },
        {
            path: ROUTERS.USER.BOOKCARTSHOPPING,
            component: <ShoppingCartPage />,
        },
        {
            path: ROUTERS.USER.CHECKOUT,
            component: <CheckoutPage />,
        },
    ];

    return (
        <MasterLayout>
        <Routes>
            {userRouters.map((item, key) => (
                <Route key={key} path={item.path} element={item.component} />
            ))}
        </Routes>
        </MasterLayout>
    );
};


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
            path: ROUTERS.ADMIN.BOOKS,
            component: <BookManagementAdPage />,
        },
        {
            path: ROUTERS.ADMIN.USERS,
            component: <UserManagementAdPage />,
        },
    ];
    return (
        <MasterLayoutAdmin>
        <Routes>
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

    return isAdminRouters ? renderAdminRouter() : renderUserRouter();
};
export default RouterCustom;
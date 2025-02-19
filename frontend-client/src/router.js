import React from "react";
import { ROUTERS } from "./utils/router";
import HomePage from "./pages/user/homePage";
import { Routes, Route } from "react-router-dom";
import MasterLayout from "./pages/user/theme/masterLayout";
import BookListProductPage from "./pages/user/bookListProductPage";

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
const RouterCustom = () => {
    return renderUserRouter();
};
export default RouterCustom;
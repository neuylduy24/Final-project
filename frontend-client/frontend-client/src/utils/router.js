export const ADMIN_PATH = "/admin";

export const ROUTERS = {
    USER: {
        HOME: "",
        LOGINPAGE: "login",
        PROFILE:"thong-tin-ca-nhan",
        BOOKNEW: "sach-moi",
        BOOKLIST: "/danh-sach-san-pham",
        BOOKDETAIL: "/danh-sach-san-pham/chi-tiet-san-pham/:id",
        BOOKCARTSHOPPING: "/gio-hang",
        CHECKOUT: "/thanh-toan",
        BOOKRANK: "sach-ban-chay",
        BOOKHISTORY: "lich-su-mua-sach",
        BOOKHOTLINE: "lien-he",
    },
    ADMIN: {
        HOME: `${ADMIN_PATH}`,
        LOGIN: `${ADMIN_PATH}/dang-nhap`,
        LOGOUT: `${ADMIN_PATH}/dang-xuat`,
        BOOKS: `${ADMIN_PATH}/quan-ly-sach`,
        USERS: `${ADMIN_PATH}/quan-ly-nguoi-dung`,
        STATISTICS: `${ADMIN_PATH}/thong-ke`,
        SETTINGS: `${ADMIN_PATH}/cai-dat`,
    }
};
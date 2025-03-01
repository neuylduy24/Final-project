export const USER_PATH = "/user";

export const ROUTERS = {
    USER: {
        HOME: `${USER_PATH}`,
        LOGINPAGE: `${USER_PATH}/login`,
        REGISTER: `${USER_PATH}/register`,
        PROFILE: `${USER_PATH}/thong-tin-ca-nhan`,
        BOOKNEW: `${USER_PATH}/sach-moi`,
        BOOKLIST: `${USER_PATH}/danh-sach-san-pham`,
        BOOKDETAIL: `${USER_PATH}/danh-sach-san-pham/chi-tiet-san-pham/:id`,
        BOOKCARTSHOPPING: `${USER_PATH}/gio-hang`,
        CHECKOUT: `${USER_PATH}/thanh-toan`,
        BOOKRANK: `${USER_PATH}/sach-ban-chay`,
        BOOKHISTORY: `${USER_PATH}/lich-su-mua-sach`,
        BOOKHOTLINE: `${USER_PATH}/lien-he`,
    },
    ADMIN: {
        HOME: "/",
        }
};
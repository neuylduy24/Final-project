export const USER_PATH = "/user";

export const ROUTERS = {
    USER: {
        HOME: `${USER_PATH}`,
        LOGINPAGE: `${USER_PATH}/login`,
        CHOOSE: `${USER_PATH}/choose-categories`,
        REGISTER: `${USER_PATH}/register`,
        FORGOTPASSWORD: `${USER_PATH}/forgot-password`,
        RESETPASSWORD: `${USER_PATH}/reset-password`,
        PROFILE: `${USER_PATH}/thong-tin-ca-nhan`,
        BOOKNEW: `${USER_PATH}/truyen-moi`,
        BOOKLIST: `${USER_PATH}/danh-sach-truyen`,
        BOOKFOLLOW: `${USER_PATH}/danh-sach-theo-doi`,
        BOOKDETAIL: `${USER_PATH}/chi-tiet-truyen/:id`,
        BOOKRANK: `${USER_PATH}/truyen-hot`,
        TOPDAY: `${USER_PATH}/top-day`,
        TOPMONTH: `${USER_PATH}/top-month`,
        TOPWEEK: `${USER_PATH}/top-week`,
        BOOKHISTORY: `${USER_PATH}/lich-su-doc-truyen`,
        COMMENT: `${USER_PATH}/binh-luan`,
        SEARCHBOOK: `${USER_PATH}/search-results`,
        CHAPTERDETAIL: `${USER_PATH}/chi-tiet-truyen/:id/chap/:chapterId`,
    },
    ADMIN: {
        HOME: "/",
        }
};
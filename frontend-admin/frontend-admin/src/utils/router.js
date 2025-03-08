export const ADMIN_PATH = "/admin";

export const ROUTERS = {
    
    ADMIN: {
        LOGIN: `${ADMIN_PATH}/dang-nhap`,
        BOOKS: `${ADMIN_PATH}/quan-ly-sach`,
        CHAPTERBOOKS: `${ADMIN_PATH}/quan-ly-chuong`,
        BOOKSCATEGORIES: `${ADMIN_PATH}/quan-ly-the-loai-sach`,
        USERS: `${ADMIN_PATH}/quan-ly-nguoi-dung`,
        ROLE: `${ADMIN_PATH}/quan-ly-quyen`,
        STATISTICS: `${ADMIN_PATH}/thong-ke`,
        SETTINGS: `${ADMIN_PATH}/cai-dat`,
    },
    USER: {
        HOME: "/",
      },
};
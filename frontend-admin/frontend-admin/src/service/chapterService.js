import axios from 'axios';

const API_URL = 'https://api.it-ebook.io.vn/api/chapters';

const chapterService = {
    // Lấy tất cả chương
    getAllChapters: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy chương theo ID
    getChapterById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy chương theo ID sách
    getChaptersByBookId: async (bookId) => {
        try {
            const response = await axios.get(`${API_URL}/book/${bookId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Tạo chương mới
    createChapter: async (chapter) => {
        try {
            const response = await axios.post(API_URL, chapter);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật chương
    updateChapter: async (id, chapter) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, chapter);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Xóa chương
    deleteChapter: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            throw error;
        }
    },

    // Lấy chương mới nhất
    getLatestChapters: async () => {
        try {
            const response = await axios.get(`${API_URL}/latest`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy top 5 chương mới nhất
    getTop5LatestChapters: async () => {
        try {
            const response = await axios.get(`${API_URL}/latest/top5`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Tăng lượt xem chương
    incrementChapterViews: async (id) => {
        try {
            await axios.post(`${API_URL}/${id}/view`);
        } catch (error) {
            throw error;
        }
    },

    // Lấy tổng lượt xem của sách
    getTotalViewsByBookId: async (bookId) => {
        try {
            const response = await axios.get(`${API_URL}/book/${bookId}/views`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default chapterService; 
import axios from 'axios';
import { API_BASE_URL, API_BASE_URLL } from './apiConfig';

const BookRankingApi = {
    // 📈 Lấy tất cả sách theo lượt follow (giảm dần)
    getAllBooksByFollow: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/books/by-follow`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy sách theo lượt follow:', error);
            throw error;
        }
    },

    // 🏆 Lấy top 10 sách có lượt follow cao nhất
    getTop10BooksByFollow: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/books/by-follow/top10`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy top 10 sách theo follow:', error);
            throw error;
        }
    },

    // 🔥 Lấy sách có lượt xem nhiều nhất (tất cả)
    getAllBooksByViewsDesc: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/books/by-views`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy sách theo lượt xem:', error);
            throw error;
        }
    },

    // 🔥 Top 10 sách có lượt xem nhiều nhất
    getTop10BooksByViews: async () => {
        try {
            const response = await axios.get(`${API_BASE_URLL}/api/books/top-views`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy top 10 sách theo lượt xem:', error);
            throw error;
        }
    },

    // 🕒 Lấy tất cả sách theo ngày tạo (giảm dần)
    getBooksSortedByCreatedDateDesc: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/books/sorted/by-date-desc`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy sách theo ngày tạo:', error);
            throw error;
        }
    },
};

export default BookRankingApi;

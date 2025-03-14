import axios from 'axios';

const API_URL = 'https://api.it-ebook.io.vn/api/books';

const bookService = {
    // Lấy tất cả sách
    getAllBooks: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy sách theo ID
    getBookById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default bookService; 
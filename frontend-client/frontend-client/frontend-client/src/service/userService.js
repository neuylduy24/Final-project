import axios from 'axios';

const API_URL = 'https://api.it-ebook.io.vn/api/users';

const userService = {
    // Lấy tất cả người dùng
    getAllUsers: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy người dùng theo ID
    getUserById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Tạo người dùng mới
    createUser: async (user) => {
        try {
            const response = await axios.post(API_URL, user);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật người dùng
    updateUser: async (id, user) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, user);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Xóa người dùng
    deleteUser: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            throw error;
        }
    },

    // Tải ảnh đại diện lên server
    uploadAvatar: async (file) => {
        try {
            // Trong môi trường thực tế, đây là nơi bạn sẽ gọi API upload avatar
            const formData = new FormData();
            formData.append('file', file);
            
            // Giả lập việc tải ảnh lên
            console.log('Simulating avatar upload', file.name);
            
            // Trả về URL giả lập
            return Promise.resolve(URL.createObjectURL(file));
            
            // Trong thực tế:
            // const response = await axios.post('https://api.it-ebook.io.vn/api/upload/avatar', formData);
            // return response.data.url;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    },

    // Cập nhật danh mục yêu thích của người dùng
    updateFavoriteCategories: async (userId, categories) => {
        try {
            const response = await axios.put(`${API_URL}/${userId}/favorite-categories`, categories);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default userService; 
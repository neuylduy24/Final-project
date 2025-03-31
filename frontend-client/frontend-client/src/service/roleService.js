import axios from 'axios';

const API_URL = 'https://api.it-ebook.io.vn/api/roles';

const roleService = {
    // Lấy tất cả vai trò
    getAllRoles: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy vai trò theo ID
    getRoleById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Tạo vai trò mới
    createRole: async (role) => {
        try {
            const response = await axios.post(API_URL, role);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật vai trò
    updateRole: async (id, role) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, role);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Xóa vai trò
    deleteRole: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            throw error;
        }
    }
};

export default roleService; 
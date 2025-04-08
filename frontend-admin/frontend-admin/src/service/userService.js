import axios from 'axios';
import { showToast } from '../utils/toast';

const API_URL = 'https://api.it-ebook.io.vn/api/users';

const userService = {
    // Get all users
    getAllUsers: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            showToast.error('❌ Error fetching user list');
            throw error;
        }
    },

    // Get user by ID
    getUserById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            showToast.error('❌ Error fetching user details');
            throw error;
        }
    },

    // Create new user
    createUser: async (user) => {
        try {
            const response = await axios.post(API_URL, user);
            return response.data;
        } catch (error) {
            showToast.error('❌ Error adding user');
            throw error;
        }
    },

    // Update user
    updateUser: async (id, user) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, user);
            return response.data;
        } catch (error) {
            showToast.error('❌ Error updating user');
            throw error;
        }
    },

    // Delete user
    deleteUser: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            showToast.error('❌ Error deleting user');
            throw error;
        }
    },

    // Upload avatar
    uploadAvatar: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            console.log('Simulating avatar upload', file.name);
            showToast.success('Avatar uploaded successfully');
            
            return Promise.resolve(URL.createObjectURL(file));
        } catch (error) {
            showToast.error('❌ Error uploading avatar');
            throw error;
        }
    },

    // Update favorite categories
    updateFavoriteCategories: async (userId, categories) => {
        try {
            const response = await axios.put(`${API_URL}/${userId}/favorite-categories`, categories);
            showToast.success('Favorite categories updated successfully');
            return response.data;
        } catch (error) {
            showToast.error('❌ Error updating favorite categories');
            throw error;
        }
    }
};

export default userService; 
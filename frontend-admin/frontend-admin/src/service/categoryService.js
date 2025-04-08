import axios from 'axios';
import { showToast } from '../utils/toast';

const API_URL = 'https://api.it-ebook.io.vn/api/categories';

const categoryService = {
    // Get all categories
    getAllCategories: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            showToast.error('Error fetching category list');
            throw error;
        }
    },

    // Get category by ID
    getCategoryById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            showToast.error('Error fetching category details');
            throw error;
        }
    },

    // Create new category
    createCategory: async (category) => {
        try {
            const response = await axios.post(API_URL, category);
            showToast.success('Category added successfully');
            return response.data;
        } catch (error) {
            showToast.error('Error adding category');
            throw error;
        }
    },

    // Update category
    updateCategory: async (id, category) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, category);
            showToast.success('Category updated successfully');
            return response.data;
        } catch (error) {
            showToast.error('Error updating category');
            throw error;
        }
    },

    // Delete category
    deleteCategory: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            showToast.success('Category deleted successfully');
        } catch (error) {
            showToast.error('Error deleting category');
            throw error;
        }
    }
};

export default categoryService;

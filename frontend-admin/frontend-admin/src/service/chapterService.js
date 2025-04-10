import axios from 'axios';
import { showToast } from '../utils/toast';

const API_URL = 'https://api.it-ebook.io.vn/api/chapters';

const chapterService = {
    // Get all chapters
    getAllChapters: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            showToast.error('Error fetching chapter list');
            throw error;
        }
    },

    // Get chapter by ID
    getChapterById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            showToast.error('Error fetching chapter details');
            throw error;
        }
    },

    // Get chapters by book ID
    getChaptersByBookId: async (bookId) => {
        try {
            const response = await axios.get(`${API_URL}/book/${bookId}`);
            return response.data;
        } catch (error) {
            showToast.error('Error fetching book chapters');
            throw error;
        }
    },

    // Create new chapter
    createChapter: async (chapter) => {
        try {
            // Ensure chapter has bookId
            if (!chapter.bookId) {
                throw new Error('Chapter must have a bookId');
            }
            
            const response = await axios.post(API_URL, chapter);
            showToast.success('Chapter added successfully');
            return response.data;
        } catch (error) {
            showToast.error('Error adding chapter');
            throw error;
        }
    },

    // Update chapter
    updateChapter: async (id, chapter) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, chapter);
            showToast.success('Chapter updated successfully');
            return response.data;
        } catch (error) {
            showToast.error('Error updating chapter');
            throw error;
        }
    },

    // Delete chapter
    deleteChapter: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            showToast.success('Chapter deleted successfully');
        } catch (error) {
            showToast.error('Error deleting chapter');
            throw error;
        }
    },

    // Get latest chapters
    getLatestChapters: async () => {
        try {
            const response = await axios.get(`${API_URL}/latest`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get top 5 latest chapters
    getTop5LatestChapters: async () => {
        try {
            const response = await axios.get(`${API_URL}/latest/top5`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Increment chapter views
    incrementChapterViews: async (id) => {
        try {
            await axios.post(`${API_URL}/${id}/view`);
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Get total views by book ID
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
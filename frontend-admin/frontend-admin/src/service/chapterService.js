import axios from 'axios';

const API_URL = 'https://api.it-ebook.io.vn/api/chapters';

const chapterService = {
    // Get all chapters
    getAllChapters: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get chapter by ID
    getChapterById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get chapters by book ID
    getChaptersByBookId: async (bookId) => {
        try {
            const response = await axios.get(`${API_URL}/book/${bookId}`);
            return response.data;
        } catch (error) {
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
            return response.data;
        } catch (error) {
            console.error('Error creating chapter:', error);
            throw error;
        }
    },

    // Update chapter
    updateChapter: async (id, chapter) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, chapter);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete chapter
    deleteChapter: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
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
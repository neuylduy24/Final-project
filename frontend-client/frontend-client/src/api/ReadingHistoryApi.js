import apiClient from './apiConfig';

export const getUserReadingHistory = async (email) => {
    try {
        const response = await apiClient.get(`/reading-history/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching reading history:", error);
        throw error;
    }
};

export const updateReadingProgress = async (email, userId, bookId, progress, timeSpent) => {
    try {
        const response = await apiClient.post('/reading-history/update', null, {
            params: { email, userId, bookId, progress, timeSpent }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating reading progress:", error);
        throw error;
    }
};
import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const BookRankingApi = {
    // Get top books by daily combined score
    getTopDailyScore: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/books/top/daily/score`);
            return response.data;
        } catch (error) {
            console.error('Error fetching top daily score:', error);
            throw error;
        }
    },

    // Get top books by weekly combined score
    getTopWeeklyScore: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/books/top/weekly/score`);
            return response.data;
        } catch (error) {
            console.error('Error fetching top weekly score:', error);
            throw error;
        }
    },

    // Get top books by monthly combined score
    getTopMonthlyScore: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/books/top/monthly/score`);
            return response.data;
        } catch (error) {
            console.error('Error fetching top monthly score:', error);
            throw error;
        }
    }
};

export default BookRankingApi;
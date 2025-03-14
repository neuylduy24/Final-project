import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: 'http://150.95.105.147:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 seconds
  withCredentials: false // không gửi cookie cross-origin
});

const getAllChapters = async () => {
  try {
    const response = await apiClient.get('/api/chapters');
    return response.data;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
};

const getChapterById = async (id) => {
  try {
    const response = await apiClient.get(`/api/chapters/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching chapter ${id}:`, error);
    throw error;
  }
};

const getChaptersByBookId = async (bookId) => {
  try {
    const response = await apiClient.get(`/api/chapters/book/${bookId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching chapters for book ${bookId}:`, error);
    throw error;
  }
};

const createChapter = async (chapterData) => {
  try {
    console.log('Sending chapter data:', JSON.stringify(chapterData)); // Debugging line
    const response = await apiClient.post('/api/chapters', chapterData);
    return response.data;
  } catch (error) {
    console.error('Error creating chapter:', error);
    console.error('Request data:', chapterData);
    console.error('Response:', error.response?.data);
    throw error;
  }
};

const updateChapter = async (id, chapterData) => {
  try {
    console.log(`Updating chapter ${id} with data:`, JSON.stringify(chapterData));
    const response = await apiClient.put(`/api/chapters/${id}`, chapterData);
    return response.data;
  } catch (error) {
    console.error(`Error updating chapter ${id}:`, error);
    console.error('Request data:', chapterData);
    console.error('Response:', error.response?.data);
    throw error;
  }
};

const deleteChapter = async (id) => {
  try {
    await apiClient.delete(`/api/chapters/${id}`);
    return id;
  } catch (error) {
    console.error(`Error deleting chapter ${id}:`, error);
    throw error;
  }
};

const getLatestChapters = async () => {
  try {
    const response = await apiClient.get(`/api/chapters/latest`);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest chapters:', error);
    throw error;
  }
};

const getTop5LatestChapters = async () => {
  try {
    const response = await apiClient.get(`/api/chapters/latest/top5`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top 5 latest chapters:', error);
    throw error;
  }
};

const incrementChapterViews = async (id) => {
  try {
    await apiClient.post(`/api/chapters/${id}/view`);
  } catch (error) {
    console.error(`Error incrementing views for chapter ${id}:`, error);
    throw error;
  }
};

const getTotalViewsByBookId = async (bookId) => {
  try {
    const response = await apiClient.get(`/api/chapters/book/${bookId}/views`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching total views for book ${bookId}:`, error);
    throw error;
  }
};

export {
  getAllChapters,
  getChapterById,
  getChaptersByBookId,
  createChapter,
  updateChapter,
  deleteChapter,
  getLatestChapters,
  getTop5LatestChapters,
  incrementChapterViews,
  getTotalViewsByBookId
};

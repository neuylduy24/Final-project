import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: 'https://api.it-ebook.io.vn',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const getAllBooks = async () => {
  try {
    const response = await apiClient.get('/api/books');
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

const getBookById = async (id) => {
  try {
    const response = await apiClient.get(`/api/books/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error);
    throw error;
  }
};

export {
  getAllBooks,
  getBookById
};

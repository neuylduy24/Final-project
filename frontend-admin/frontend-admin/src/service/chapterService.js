import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: 'https://api.it-ebook.io.vn',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  timeout: 15000, // Tăng thời gian timeout lên 15 giây
  withCredentials: false // không gửi cookie cross-origin
});

// Thêm interceptor để log mọi request
apiClient.interceptors.request.use(request => {
  console.log('Bắt đầu request:', request);
  return request;
});

// Thêm interceptor để log mọi response
apiClient.interceptors.response.use(
  response => {
    console.log('Nhận phản hồi thành công:', response);
    return response;
  },
  error => {
    console.log('Lỗi phản hồi:', error);
    return Promise.reject(error);
  }
);

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
    // Đảm bảo chapterNumber là số
    const formattedData = {
      ...chapterData,
      chapterNumber: Number(chapterData.chapterNumber)
    };
    
    console.log('Dữ liệu gửi đi:', JSON.stringify(formattedData, null, 2));
    const response = await apiClient.post('/api/chapters', formattedData);
    console.log('Phản hồi thành công:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo chương:', error);
    console.error('Dữ liệu request:', JSON.stringify(chapterData, null, 2));
    if (error.response) {
      console.error('Mã lỗi:', error.response.status);
      console.error('Dữ liệu phản hồi:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Không nhận được phản hồi:', error.request);
    } else {
      console.error('Lỗi cấu hình request:', error.message);
    }
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

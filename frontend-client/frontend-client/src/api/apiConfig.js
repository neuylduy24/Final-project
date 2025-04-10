import axios from "axios";

export const API_BASE_URL = "https://api.it-ebook.io.vn"; // 🔹 URL API chính xác

export default API_BASE_URL;

export const API_ENDPOINTS = {
  GET_USER_READING_HISTORY: "/api/reading-history",

  // Endpoint dùng để lưu lịch sử đọc, phải đúng với backend
  UPDATE_READING_PROGRESS: "/api/reading-history/start-or-update",

  GET_BOOK_BY_ID: (bookId) => `/books/${bookId}`,
};

export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const API_TIMEOUT = 15000; // Timeout 15s

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const AUTH_HEADERS = (token) => ({
  ...DEFAULT_HEADERS,
  Authorization: `Bearer ${token}`,
});

// Tạo instance của axios nếu cần dùng chung
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: DEFAULT_HEADERS,
});

// Thêm interceptor để tự động gắn token vào header request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Lỗi API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

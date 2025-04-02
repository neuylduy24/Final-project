// src/api/apiConfig.js
const API_BASE_URL = "http://localhost:8080/api"; // ⚡ Đổi khi deploy lên server production

export default API_BASE_URL;

export const API_ENDPOINTS = {
  GET_USER_READING_HISTORY: '/reading-history', // 🛠️ Đổi thành POST để gửi email trong body
  UPDATE_READING_PROGRESS: '/reading-history/update', // 🔄 POST để cập nhật tiến trình đọc
  GET_BOOKS: '/books',
  GET_BOOK_BY_ID: (bookId) => `/books/${bookId}`,
  GET_BOOKS_BY_AUTHOR: (author) => `/books/author/${author}`,
  GET_BOOKS_BY_GENRE: (genre) => `/books/genre/${genre}`,
  GET_FOLLOWED_BOOKS: (userId) => `/follow-books/user/${userId}`,
  FOLLOW_BOOK: '/follow-books', // 🆕 API theo dõi sách
  UNFOLLOW_BOOK: (userId, bookId) => `/follow-books/user/${userId}/book/${bookId}` // 🛠️ API bỏ theo dõi sách
};

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export const API_TIMEOUT = 15000; // ⏳ Giảm timeout xuống 15s để phản hồi nhanh hơn

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export const AUTH_HEADERS = (token) => ({
  ...DEFAULT_HEADERS,
  Authorization: `Bearer ${token}` // 🛡️ Thêm JWT Token cho các API cần xác thực
});

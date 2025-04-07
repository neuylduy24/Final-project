// src/api/readingHistoryApi.js
import axios from "axios";
import API_BASE_URL, { API_ENDPOINTS, AUTH_HEADERS } from "./apiConfig";

export const fetchReadingHistory = async (email, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.GET_USER_READING_HISTORY}/${email}`, // ✅ Thêm email vào URL
      { headers: AUTH_HEADERS(token) }
    );
    

    // Lấy thông tin sách từ API
    const enrichedHistory = await Promise.all(
      response.data.map(async (item) => {
        try {
          const bookResponse = await axios.get(
            `${API_BASE_URL}${API_ENDPOINTS.GET_BOOK_BY_ID(item.bookId)}`,
            { headers: AUTH_HEADERS(token) }
          );
          return {
            ...item,
            book: bookResponse.data, // Gán thông tin sách đầy đủ
          };
        } catch (error) {
          console.error("Lỗi khi lấy thông tin sách:", error);
          return {
            ...item,
            book: {
              title: "Unknown",
              image: "path/to/default-image.jpg", // Đường dẫn tới ảnh mặc định
            }, // Thêm thông tin lỗi với hình ảnh mặc định
          };
        }
      })
    );
    return enrichedHistory;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to load history.");
  }
};

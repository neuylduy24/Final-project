import axios from "axios";

const API_URL = "http://150.95.105.147:8080/api";

export const getAllBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy danh sách sách: " + error.message);
  }
};

export const getBookById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/books/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Không thể lấy thông tin sách: " + error.message);
  }
};

export const createBook = async (book) => {
  try {
    // Kiểm tra xem sách đã tồn tại chưa
    const books = await getAllBooks();
    const existingBook = books.find(b => b.title === book.title);
    if (existingBook) {
      throw new Error(`Sách với tiêu đề '${book.title}' đã tồn tại!`);
    }
    
    const response = await axios.post(`${API_URL}/books`, book);
    return response.data;
  } catch (error) {
    throw new Error("Không thể tạo sách mới: " + error.message);
  }
};

export const updateBook = async (id, bookDetails) => {
  try {
    const response = await axios.put(`${API_URL}/books/${id}`, bookDetails);
    return response.data;
  } catch (error) {
    throw new Error(`Không thể cập nhật sách với id ${id}: ` + error.message);
  }
};

export const deleteBook = async (id) => {
  try {
    await axios.delete(`${API_URL}/books/${id}`);
    return true;
  } catch (error) {
    throw new Error(`Không thể xóa sách với id ${id}: ` + error.message);
  }
};

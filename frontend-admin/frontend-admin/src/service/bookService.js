import axios from "axios";
import { showToast } from "../utils/toast";

const API_URL = "https://api.it-ebook.io.vn/api/books";

const bookService = {
  // Get all books
  getAllBooks: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  // Get book by ID
  getBookById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      showToast.error("Error fetching book details");
      throw error;
    }
  },

  // Get book details with feedback
  getBookDetails: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}/details`);
      return response.data;
    } catch (error) {
      showToast.error("Error fetching book details with feedback");
      throw error;
    }
  },

  // Search books by title
  searchBooksByTitle: async (title) => {
    try {
      const response = await axios.get(`${API_URL}/search?title=${encodeURIComponent(title)}`);
      return response.data;
    } catch (error) {
      showToast.error("Error searching books");
      throw error;
    }
  },

  // Get books by author
  getBooksByAuthor: async (authorId) => {
    try {
      const response = await axios.get(`${API_URL}/author/${authorId}`);
      return response.data;
    } catch (error) {
      showToast.error("Error fetching author's books");
      throw error;
    }
  },

  // Get books sorted by date
  getBooksSortedByDate: async () => {
    try {
      const response = await axios.get(`${API_URL}/sorted/by-date-desc`);
      return response.data;
    } catch (error) {
      showToast.error("Error fetching sorted books");
      throw error;
    }
  },

  // Create new book
  createBook: async (bookData) => {
    try {
      // Validate required fields
      if (!bookData.title) {
        throw new Error("Title is required");
      }

      // Validate image URL format if provided
      if (bookData.image && !bookData.image.match(/^(http|https):\/\/.*$/)) {
        throw new Error("Invalid image URL format. Must start with http:// or https://");
      }

      const response = await axios.post(API_URL, bookData);
      return response.data;
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  },

  // Update book
  updateBook: async (id, bookData) => {
    try {
      // Validate required fields
      if (!bookData.title) {
        throw new Error("Title is required");
      }

      // Validate image URL format if provided
      if (bookData.image && !bookData.image.match(/^(http|https):\/\/.*$/)) {
        throw new Error("Invalid image URL format. Must start with http:// or https://");
      }

      const response = await axios.put(`${API_URL}/${id}`, bookData);
      return response.data;
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
  },

  // Delete book
  deleteBook: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  },

  // Chapter related methods

  // Add new chapter to book
  addChapterToBook: async (bookId, chapter) => {
    try {
      const book = await bookService.getBookById(bookId);

      if (!book) {
        showToast.error("Book not found");
        throw new Error("Book not found");
      }

      if (!book.chapters) {
        book.chapters = [];
      }

      const randomHexId = Array.from({ length: 24 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      chapter.id = randomHexId;

      book.chapters.push(chapter);

      const response = await axios.put(`${API_URL}/${bookId}`, book);
      showToast.success("Chapter added successfully");
      return response.data;
    } catch (error) {
      showToast.error("Error adding chapter");
      throw error;
    }
  },

  // Get all chapters of a book
  getBookChapters: async (bookId) => {
    try {
      const book = await bookService.getBookById(bookId);

      if (!book) {
        showToast.error("Book not found");
        throw new Error("Book not found");
      }

      return book.chapters || [];
    } catch (error) {
      showToast.error("Error fetching chapters");
      throw error;
    }
  },

  // Cập nhật chương trong sách
  updateChapterInBook: async (bookId, chapterId, updatedChapter) => {
    try {
      const book = await bookService.getBookById(bookId);

      if (!book || !book.chapters) {
        throw new Error("Không tìm thấy sách hoặc sách không có chương");
      }

      // Tìm index của chapter cần cập nhật
      const chapterIndex = book.chapters.findIndex((ch) => ch.id === chapterId);

      if (chapterIndex === -1) {
        throw new Error("Không tìm thấy chương");
      }

      // Cập nhật chapter
      book.chapters[chapterIndex] = {
        ...book.chapters[chapterIndex],
        ...updatedChapter,
        id: chapterId, // Giữ nguyên ID
      };

      // Cập nhật lại book
      const response = await axios.put(`${API_URL}/${bookId}`, book);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa chương khỏi sách
  deleteChapterFromBook: async (bookId, chapterId) => {
    try {
      const book = await bookService.getBookById(bookId);

      if (!book || !book.chapters) {
        throw new Error("Không tìm thấy sách hoặc sách không có chương");
      }

      // Lọc ra các chapter không phải chapterId
      book.chapters = book.chapters.filter((ch) => ch.id !== chapterId);

      // Cập nhật lại book
      const response = await axios.put(`${API_URL}/${bookId}`, book);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tăng lượt xem cho chapter
  incrementChapterViews: async (bookId, chapterId) => {
    try {
      const book = await bookService.getBookById(bookId);

      if (!book || !book.chapters) {
        throw new Error("Không tìm thấy sách hoặc sách không có chương");
      }

      // Tìm chapter cần tăng lượt xem
      const chapter = book.chapters.find((ch) => ch.id === chapterId);

      if (!chapter) {
        throw new Error("Không tìm thấy chương");
      }

      // Tăng lượt xem
      chapter.views = (chapter.views || 0) + 1;

      // Cập nhật lại book
      const response = await axios.put(`${API_URL}/${bookId}`, book);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload book image
  uploadBookImage: async (bookId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await axios.post(
        `${API_URL}/${bookId}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading book image:", error);
      throw error;
    }
  },

  // Get book image
  getBookImage: async (bookId) => {
    try {
      const response = await axios.get(`${API_URL}/${bookId}/image`, {
        responseType: 'arraybuffer'
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching book image:", error);
      throw error;
    }
  },

  // Increment book views
  incrementBookViews: async (bookId) => {
    try {
      const response = await axios.post(`${API_URL}/${bookId}/increment-views`);
      return response.data;
    } catch (error) {
      console.error("Error incrementing book views:", error);
      throw error;
    }
  }
};

export default bookService;

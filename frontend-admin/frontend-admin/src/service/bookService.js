import axios from 'axios';

const API_URL = 'https://api.it-ebook.io.vn/api/books';

const bookService = {
    // Lấy tất cả sách
    getAllBooks: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy sách theo ID
    getBookById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Tạo sách mới
    createBook: async (book) => {
        try {
            const response = await axios.post(API_URL, book);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật sách
    updateBook: async (id, book) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, book);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Xóa sách
    deleteBook: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            throw error;
        }
    },
    
    // Phương thức liên quan đến Chapter
    
    // Thêm chương mới vào sách
    addChapterToBook: async (bookId, chapter) => {
        try {
            const book = await bookService.getBookById(bookId);
            
            if (!book) {
                throw new Error('Không tìm thấy sách');
            }
            
            // Nếu book.chapters chưa tồn tại, khởi tạo là mảng rỗng
            if (!book.chapters) {
                book.chapters = [];
            }
            
            // Tạo ID cho chapter mới
            chapter.id = `chap${book.chapters.length + 1}`;
            
            // Thêm chapter vào mảng chapters của book
            book.chapters.push(chapter);
            
            // Cập nhật lại book
            const response = await axios.put(`${API_URL}/${bookId}`, book);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    // Lấy tất cả chương của một sách
    getBookChapters: async (bookId) => {
        try {
            const book = await bookService.getBookById(bookId);
            
            if (!book) {
                throw new Error('Không tìm thấy sách');
            }
            
            return book.chapters || [];
        } catch (error) {
            throw error;
        }
    },
    
    // Cập nhật chương trong sách
    updateChapterInBook: async (bookId, chapterId, updatedChapter) => {
        try {
            const book = await bookService.getBookById(bookId);
            
            if (!book || !book.chapters) {
                throw new Error('Không tìm thấy sách hoặc sách không có chương');
            }
            
            // Tìm index của chapter cần cập nhật
            const chapterIndex = book.chapters.findIndex(ch => ch.id === chapterId);
            
            if (chapterIndex === -1) {
                throw new Error('Không tìm thấy chương');
            }
            
            // Cập nhật chapter
            book.chapters[chapterIndex] = {
                ...book.chapters[chapterIndex],
                ...updatedChapter,
                id: chapterId // Giữ nguyên ID
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
                throw new Error('Không tìm thấy sách hoặc sách không có chương');
            }
            
            // Lọc ra các chapter không phải chapterId
            book.chapters = book.chapters.filter(ch => ch.id !== chapterId);
            
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
                throw new Error('Không tìm thấy sách hoặc sách không có chương');
            }
            
            // Tìm chapter cần tăng lượt xem
            const chapter = book.chapters.find(ch => ch.id === chapterId);
            
            if (!chapter) {
                throw new Error('Không tìm thấy chương');
            }
            
            // Tăng lượt xem
            chapter.views = (chapter.views || 0) + 1;
            
            // Cập nhật lại book
            const response = await axios.put(`${API_URL}/${bookId}`, book);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default bookService; 
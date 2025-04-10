import axios from 'axios';

const API_URL = 'https://api.it-ebook.io.vn/api';

const bookService = {
    // Lấy tất cả sách
    getAllBooks: async () => {
        try {
            const response = await axios.get(API_URL + '/books');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getBooksFavorite: async () => {
        try {
            const response = await axios.get(API_URL + '/books/recommend-by-categories');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy chi tiết sách
    getBookById: async (bookId) => {
        try {
            const response = await axios.get(API_URL + '/books/' + bookId);
            return response.data;
        } catch (error) {
            console.error("Error fetching book:", error);
            throw error;
        }
    },

    // Lấy thống kê của sách (views, follows)
    getBookStats: async (bookId) => {
        try {
            const response = await axios.get(API_URL + '/books/' + bookId + '/details');
            return response.data;
        } catch (error) {
            console.error("Error fetching book stats:", error);
            throw error;
        }
    },

    // Lấy rating trung bình
    getAverageRating: async (bookId) => {
        try {
            const response = await axios.get(API_URL + '/feedbacks/average-rating/' + bookId);
            return response.data;
        } catch (error) {
            console.error("Error fetching average rating:", error);
            throw error;
        }
    },

    // Lấy danh sách chapter của sách
    getChaptersByBookId: async (bookId) => {
        try {
            const response = await axios.get(API_URL + '/chapters/book/' + bookId);
            return response.data;
        } catch (error) {
            console.error("Error fetching chapters:", error);
            throw error;
        }
    },

    // Lấy tổng số comment của sách và các chapter
    getTotalComments: async (bookId) => {
        try {
            // Lấy comment của book
            const bookCommentsResponse = await axios.get(
                API_URL + '/feedbacks/type/' + bookId + '?type=COMMENT'
            );
            let totalBookComments = 0;
            if (bookCommentsResponse.status === 200 && Array.isArray(bookCommentsResponse.data)) {
                totalBookComments = bookCommentsResponse.data.length;
            }

            // Lấy danh sách chapter
            const chaptersResponse = await axios.get(API_URL + '/chapters/book/' + bookId);
            let totalChapterComments = 0;

            if (chaptersResponse.status === 200 && Array.isArray(chaptersResponse.data)) {
                const chapters = chaptersResponse.data;
                
                // Lấy comment của tất cả chapter song song
                const chapterCommentsPromises = chapters.map(chapter => 
                    axios.get(API_URL + '/feedbacks/type/chapter/' + chapter.id + '?type=COMMENT')
                        .then(response => {
                            if (response.status === 200 && Array.isArray(response.data)) {
                                return response.data.length;
                            }
                            return 0;
                        })
                        .catch(() => 0)
                );

                const chapterCommentCounts = await Promise.all(chapterCommentsPromises);
                totalChapterComments = chapterCommentCounts.reduce((sum, count) => sum + count, 0);
            }

            return {
                bookComments: totalBookComments,
                chapterComments: totalChapterComments,
                total: totalBookComments + totalChapterComments
            };
        } catch (error) {
            console.error("Error fetching total comments:", error);
            throw error;
        }
    },

    // Lấy 3 chapter mới nhất
    getLatestChapters: async (bookId) => {
        try {
            const response = await axios.get(API_URL + '/chapters/book/' + bookId);
            if (response.status === 200 && Array.isArray(response.data)) {
                // Sắp xếp theo thời gian tạo mới nhất
                const sortedChapters = response.data.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                // Trả về 3 chapter mới nhất
                return sortedChapters.slice(0, 3);
            }
            return [];
        } catch (error) {
            console.error("Error fetching latest chapters:", error);
            throw error;
        }
    },

    // Thêm sách mới
    createBook: async (bookData) => {
        try {
            const response = await axios.post(API_URL + '/books', bookData);
            return response.data;
        } catch (error) {
            console.error("Error creating book:", error);
            throw error;
        }
    },

    // Cập nhật thông tin sách
    updateBook: async (bookId, bookData) => {
        try {
            const response = await axios.put(API_URL + '/books/' + bookId, bookData);
            return response.data;
        } catch (error) {
            console.error("Error updating book:", error);
            throw error;
        }
    },

    // Xóa sách
    deleteBook: async (bookId) => {
        try {
            const response = await axios.delete(API_URL + '/books/' + bookId);
            return response.data;
        } catch (error) {
            console.error("Error deleting book:", error);
            throw error;
        }
    },

    // Follow/Unfollow sách
    toggleFollow: async (bookId, token) => {
        try {
            const response = await axios.post(
                API_URL + '/books/' + bookId + '/follow',
                {},
                { headers: { Authorization: 'Bearer ' + token } }
            );
            return response.data;
        } catch (error) {
            console.error("Error toggling follow:", error);
            throw error;
        }
    },

    // Kiểm tra trạng thái follow
    checkFollowStatus: async (bookId, token) => {
        try {
            const response = await axios.get(
                API_URL + '/books/' + bookId + '/follow/status',
                { headers: { Authorization: 'Bearer ' + token } }
            );
            return response.data;
        } catch (error) {
            console.error("Error checking follow status:", error);
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
            
            // Tạo ID ngẫu nhiên dạng chuỗi hex cho chapter mới 
            const randomHexId = Array.from({length: 24}, () => 
                Math.floor(Math.random() * 16).toString(16)).join('');
            chapter.id = randomHexId;
            
            // Thêm chapter vào mảng chapters của book
            book.chapters.push(chapter);
            
            // Cập nhật lại book
            const response = await axios.put(API_URL + '/books/' + bookId, book);
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
            const response = await axios.put(API_URL + '/books/' + bookId, book);
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
            const response = await axios.put(API_URL + '/books/' + bookId, book);
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
            const response = await axios.put(API_URL + '/books/' + bookId, book);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default bookService;
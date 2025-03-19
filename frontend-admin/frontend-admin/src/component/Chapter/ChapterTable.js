import React, { useState, useEffect } from 'react';
import bookService from '../../service/bookService';

const ChapterTable = ({ 
    chapters, 
    handleEdit, 
    handleDelete, 
    setShowForm,
    selectedBookId,
    handleBookFilterChange,
    books: propBooks
}) => {
    const [bookTitles, setBookTitles] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortedChapters, setSortedChapters] = useState([]);
    const [books, setBooks] = useState([]);
    
    useEffect(() => {
        // Nếu có books được truyền từ props, sử dụng nó
        if (propBooks && propBooks.length > 0) {
            setBooks(propBooks);
        } else {
            fetchBooks();
        }
    }, [propBooks]);

    useEffect(() => {
        if (chapters && chapters.length > 0) {
            // Sắp xếp chapter theo bookId và chapterNumber
            const sorted = [...chapters].sort((a, b) => {
                // So sánh trước theo bookId
                if (a.bookId !== b.bookId) {
                    return a.bookId.localeCompare(b.bookId);
                }
                // Nếu cùng bookId thì so sánh theo chapterNumber
                return parseInt(a.chapterNumber) - parseInt(b.chapterNumber);
            });
            
            setSortedChapters(sorted);
        } else {
            setSortedChapters([]);
        }
        
        // Tạo mapping từ bookId đến bookTitle
        const titles = {};
        books.forEach(book => {
            titles[book.id] = book.title;
        });
        setBookTitles(titles);
    }, [books, chapters]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await bookService.getAllBooks();
            setBooks(data);
            setError(null);
        } catch (err) {
            setError("Không thể tải thông tin sách");
            console.error("Error fetching books:", err);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý thay đổi sách được lọc
    const onBookFilterChange = (e) => {
        // Gọi hàm từ component cha nếu có
        if (handleBookFilterChange) {
            handleBookFilterChange(e.target.value);
        }
    };

    // Hàm format số chương
    const formatChapterNumber = (number) => {
        if (number === null || number === undefined) return 'N/A';
        
        // Luôn hiển thị số chương dưới dạng số nguyên
        return parseInt(number).toString();
    };

    // Hàm format ngày tạo
    const formatCreatedDate = (dateString) => {
        if (!dateString) return 'Chưa có thông tin';
        
        try {
            // Xử lý cả trường hợp nhận ISO string hoặc timestamp
            const date = new Date(dateString);
            
            // Kiểm tra nếu là ngày hợp lệ
            if (isNaN(date.getTime())) {
                return 'Ngày không hợp lệ';
            }
            
            // Tạo options chỉ định múi giờ Việt Nam
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Ho_Chi_Minh'  // Múi giờ Việt Nam
            };
            
            // Format ngày theo định dạng Việt Nam
            return new Intl.DateTimeFormat('vi-VN', options).format(date);
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'Lỗi định dạng ngày';
        }
    };

    const handleEditChapter = (chapter) => {
        // Đặt thông tin chương vào form để chỉnh sửa
        const chapterToEdit = {
            ...chapter,
            bookId: chapter.bookId // Đảm bảo bookId được thiết lập chính xác
        };
        handleEdit(chapterToEdit);
    };

    const handleDeleteChapter = (bookId, chapterId) => {
        // Gọi hàm xóa chương từ component cha
        handleDelete(bookId, chapterId);
    };

    if (loading && books.length === 0) {
        return <div className="loading-container">Đang tải danh sách chương...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="table-container">
            <div className="table-header">
                <h2>Danh sách chương</h2>
                <div className="table-actions">
                    <div className="filter-container">
                        <label htmlFor="bookFilter">Lọc theo sách:</label>
                        <select 
                            id="bookFilter" 
                            value={selectedBookId || ''} 
                            onChange={onBookFilterChange}
                            className="book-filter"
                        >
                            <option value="">Tất cả sách</option>
                            {books.map(book => (
                                <option key={book.id} value={book.id}>
                                    {book.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="btn-add" onClick={() => setShowForm(true)}>
                        Thêm chương mới
                    </button>
                </div>
            </div>
            
            {sortedChapters.length === 0 ? (
                <div className="no-data">
                    {selectedBookId 
                        ? 'Sách này chưa có chương nào. Hãy thêm chương mới.' 
                        : 'Chưa có chương nào. Hãy thêm chương mới.'}
                </div>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên sách</th>
                            <th>Số chương</th>
                            <th>Tiêu đề</th>
                            <th>Lượt xem</th>
                            <th>Ngày tải lên</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedChapters.map((chapter) => (
                            <tr key={`${chapter.bookId}-${chapter.id}`}>
                                <td>{chapter.id}</td>
                                <td>{chapter.bookTitle || bookTitles[chapter.bookId] || 'Không tìm thấy'}</td>
                                <td>{formatChapterNumber(chapter.chapterNumber)}</td>
                                <td>{chapter.title}</td>
                                <td>{chapter.views || 0}</td>
                                <td>{formatCreatedDate(chapter.createdAt)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEditChapter(chapter)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDeleteChapter(chapter.bookId, chapter.id)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ChapterTable;

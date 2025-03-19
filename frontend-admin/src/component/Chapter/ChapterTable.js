import React, { useState, useEffect } from 'react';
import bookService from '../../service/bookService';
import Pagination from '../common/Pagination';

const ChapterTable = ({ chapters, handleEdit, handleDelete, setShowForm, selectedBookId }) => {
    const [bookTitles, setBookTitles] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filteredChapters, setFilteredChapters] = useState([]);
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        fetchBooks();
    }, []);

    // Reset trang khi selectedBookId thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedBookId]);

    // Thêm useEffect để lọc các chương khi chapters hoặc selectedBookId thay đổi
    useEffect(() => {
        if (chapters && chapters.length > 0) {
            let filtered = chapters;
            
            if (selectedBookId && selectedBookId !== "all") {
                filtered = chapters.filter(chapter => chapter.bookId === selectedBookId);
            }
            
            // Sắp xếp các chapter đã lọc
            const sorted = [...filtered].sort((a, b) => {
                // So sánh trước theo bookId
                if (a.bookId !== b.bookId) {
                    return a.bookId.localeCompare(b.bookId);
                }
                // Nếu cùng bookId thì so sánh theo chapterNumber
                return parseInt(a.chapterNumber) - parseInt(b.chapterNumber);
            });
            
            setFilteredChapters(sorted);
        } else {
            setFilteredChapters([]);
        }
    }, [chapters, selectedBookId]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await bookService.getAllBooks();
            setBooks(data);
            
            // Tạo mapping từ bookId đến bookTitle
            const titles = {};
            data.forEach(book => {
                titles[book.id] = book.title;
            });
            setBookTitles(titles);
            
            setError(null);
        } catch (err) {
            setError("Không thể tải thông tin sách");
            console.error("Error fetching books:", err);
        } finally {
            setLoading(false);
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
        if (!dateString) return 'N/A';
        
        try {
            // Xử lý cả trường hợp nhận ISO string hoặc timestamp
            const date = new Date(dateString);
            
            // Kiểm tra nếu là ngày hợp lệ
            if (isNaN(date.getTime())) {
                return 'N/A';
            }
            
            // Format ngày theo định dạng Việt Nam
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'N/A';
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

    // Tính toán phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredChapters.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);

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
            </div>
            
            {filteredChapters.length === 0 ? (
                <div className="no-data">
                    {selectedBookId !== "all" 
                        ? "Sách này chưa có chương nào. Hãy thêm chương mới." 
                        : "Chưa có chương nào. Hãy thêm chương mới."}
                </div>
            ) : (
                <>
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
                            {currentItems.map((chapter) => (
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
                    
                    {filteredChapters.length > itemsPerPage && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ChapterTable;

import React, { useState, useEffect, useMemo } from 'react';
import bookService from '../../service/bookService';

const ChapterTable = ({ chapters, handleEdit, handleDelete, setShowForm }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await bookService.getAllBooks(); // Lấy tất cả sách một lần
            setBooks(data);
        } catch (err) {
            setError("Không thể tải danh sách sách");
            console.error("Error fetching books:", err);
        } finally {
            setLoading(false);
        }
    };

    // Dùng useMemo để tạo ánh xạ ID -> title, tránh tính toán lại không cần thiết
    const bookTitleMap = useMemo(() => {
        return books.reduce((acc, book) => {
            acc[book.id] = book.title;
            return acc;
        }, {});
    }, [books]);

    // Hàm format ngày tạo
    const formatCreatedDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
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

    return (
        <div className="table-container">
            <div className="table-header">
                <h2>Danh sách chương</h2>
                <button className="btn-add" onClick={() => setShowForm(true)}>
                    Thêm chương mới
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên sách</th>
                        <th>Số chương</th>
                        <th>Tiêu đề</th>
                        <th>Lượt xem</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {chapters.map((chapter) => (
                        <tr key={chapter.id}>
                            <td>{chapter.id}</td>
                            <td>
                                {loading ? (
                                    <span className="loading-text">Đang tải...</span>
                                ) : error ? (
                                    <span className="error-text">{error}</span>
                                ) : (
                                    bookTitleMap[chapter.bookId] || 'Không tìm thấy'
                                )}
                            </td>
                            <td>{chapter.chapterNumber}</td>
                            <td>{chapter.title}</td>
                            <td>{chapter.views}</td>
                            <td>{formatCreatedDate(chapter.createdAt)}</td>
                            <td>
                                <div className="action-buttons">
                                    <button className="btn-edit" onClick={() => handleEdit(chapter)}>Sửa</button>
                                    <button className="btn-delete" onClick={() => handleDelete(chapter.id)}>Xóa</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChapterTable;

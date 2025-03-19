import React, { useState, useEffect } from "react";
import ChapterForm from "../../component/Chapter/ChapterForm";
import ChapterTable from "../../component/Chapter/ChapterTable";
import Pagination from "../../component/common/Pagination";
import bookService from "../../service/bookService";
import "../../styles/chapterManagement.css";

const ChapterManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    bookId: "",
    chapterNumber: "",
    title: "",
    content: "",
    images: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState("all"); // Giá trị mặc định "all" để hiển thị tất cả
  const [allChapters, setAllChapters] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBooks();
  }, []);

  // Lấy tất cả chương từ tất cả sách
  useEffect(() => {
    if (books && books.length > 0) {
      const chaptersFromBooks = [];
      books.forEach(book => {
        if (book.chapters && book.chapters.length > 0) {
          // Thêm bookId và bookTitle vào mỗi chương để dễ truy xuất
          const chaptersWithBookInfo = book.chapters.map(chapter => ({
            ...chapter,
            bookId: book.id,
            bookTitle: book.title
          }));
          chaptersFromBooks.push(...chaptersWithBookInfo);
        }
      });
      setAllChapters(chaptersFromBooks);
    } else {
      setAllChapters([]);
    }
  }, [books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách sách. Vui lòng thử lại sau.");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, success) => {
    // Nếu đã được xử lý thành công trong ChapterForm
    if (success) {
      // Refresh lại danh sách sách
      fetchBooks();
      setForm({
        bookId: "",
        chapterNumber: "",
        title: "",
        content: "",
        images: []
      });
      setIsEditing(false);
      setShowForm(false);
    }
  };

  const handleEdit = (chapter) => {
    setForm(chapter);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (bookId, chapterId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chương này?")) {
      try {
        await bookService.deleteChapterFromBook(bookId, chapterId);
        // Refresh lại danh sách sách
        fetchBooks();
        setError(null);
      } catch (err) {
        setError("Không thể xóa chương: " + err.message);
        console.error("Error deleting chapter:", err);
      }
    }
  };

  const handleFilterChange = (e) => {
    setSelectedBookId(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi đổi bộ lọc
  };

  if (loading && books.length === 0) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="container">
      <div className="container-management">
        <h2>Quản lý chương</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="filter-container">
          <label htmlFor="bookFilter">Lọc theo sách:</label>
          <select
            id="bookFilter"
            value={selectedBookId}
            onChange={handleFilterChange}
            className="book-filter"
          >
            <option value="all">Tất cả sách</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
          <button className="btn-add" onClick={() => setShowForm(true)}>
            Thêm chương mới
          </button>
        </div>

        {showForm && (
          <ChapterForm
            form={form}
            setForm={setForm}
            handleSubmit={handleSubmit}
            closeForm={() => setShowForm(false)}
            isEditing={isEditing}
          />
        )}

        <ChapterTable
          chapters={allChapters}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setShowForm={setShowForm}
          selectedBookId={selectedBookId}
        />
      </div>
    </div>
  );
};

export default ChapterManagementPage;

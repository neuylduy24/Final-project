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
  const [selectedBookId, setSelectedBookId] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBooks();
  }, []);

  // Reset trang về 1 khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBookId]);

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

  // Xử lý thay đổi bộ lọc sách
  const handleBookFilterChange = (bookId) => {
    setSelectedBookId(bookId);
  };

  // Tạo một mảng chứa tất cả các chương từ tất cả các sách
  const getAllChapters = () => {
    const allChapters = [];
    books.forEach(book => {
      // Nếu có bộ lọc sách, chỉ lấy chương của sách đó
      if (selectedBookId && book.id !== selectedBookId) {
        return;
      }
      
      if (book.chapters && book.chapters.length > 0) {
        // Thêm bookId và bookTitle vào mỗi chương để dễ truy xuất
        const chaptersWithBookInfo = book.chapters.map(chapter => ({
          ...chapter,
          bookId: book.id,
          bookTitle: book.title
        }));
        allChapters.push(...chaptersWithBookInfo);
      }
    });
    return allChapters;
  };

  const allChapters = getAllChapters();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allChapters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allChapters.length / itemsPerPage);

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="container">
      <div className="container-management">
        <h2>Quản lý chương</h2>

        {error && <div className="error-message">{error}</div>}

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
          chapters={currentItems}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setShowForm={setShowForm}
          selectedBookId={selectedBookId}
          handleBookFilterChange={handleBookFilterChange}
          books={books}
        />

        {allChapters.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default ChapterManagementPage;

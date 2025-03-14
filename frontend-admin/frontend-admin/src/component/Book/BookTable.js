import React, { useEffect, useState } from "react";
import axios from "axios";
import BookForm from "./BookForm";
import { FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookTable = ({ currentPage, booksPerPage, setCurrentPage }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books, setCurrentPage]);

  async function fetchBooks() {
    try {
      const response = await axios.get("https://api.it-ebook.io.vn/api/books");
      setBooks(response.data);
    } catch (error) {
      toast.error("❌ Lỗi khi lấy dữ liệu sách!");
    }
  }

  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowForm(true);
    setIsEditing(true);
  };

  const handleSave = async (book) => {
    try {
      if (!isEditing) {
        const newBook = {
          ...book,
          createdAt: new Date().toISOString(),
        };
        await axios.post("http://150.95.105.147:8080/api/books", newBook);
        toast.success("📖 Thêm sách thành công!");
      } else {
        await axios.put(
          `http://150.95.105.147:8080/api/books/${book.id}`,
          book
        );
        toast.info("✏️ Cập nhật sách thành công!");
      }
      fetchBooks();
      setShowForm(false);
    } catch (error) {
      toast.error("❌ Lỗi khi lưu sách!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://150.95.105.147:8080/api/books/${id}`);
      fetchBooks();
      toast.warning("🗑️ Xóa sách thành công!");
    } catch (error) {
      toast.error("❌ Lỗi khi xóa sách!");
    }
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />

      {showForm && (
        <BookForm
          book={selectedBook}
          onSave={handleSave}
          setShowForm={setShowForm}
          isEditing={isEditing}
        />
      )}

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Tìm kiếm sách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="add-button"
          onClick={() => {
            setSelectedBook(null);
            setShowForm(true);
            setIsEditing(false);
          }}
        >
          Thêm
        </button>
      </div>

      <table className="container-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh bìa</th>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Thể loại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td className="book-image-cell">
                  {book.image ? (
                    <img 
                      src={book.image} 
                      alt={book.title} 
                      style={{ width: "50px", height: "75px", objectFit: "cover" }} 
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      Không có ảnh
                    </div>
                  )}
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  {Array.isArray(book.category)
                    ? book.category.map((cat) => cat.name).join(", ")
                    : book.category}
                </td>

                <td className="button-group">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(book)}
                  >
                    Sửa
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(book.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Không có sách nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;

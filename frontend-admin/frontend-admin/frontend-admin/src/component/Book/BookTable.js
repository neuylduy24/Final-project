<<<<<<< Updated upstream
=======
import React, { useEffect, useState } from "react";
import BookForm from "./BookForm";
import { FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllBooks, createBook, updateBook, deleteBook } from "../../service/bookService";
import axios from "axios";

const BookTable = ({ currentPage, booksPerPage, setCurrentPage }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    author: "",
    image: "",
    description: "",
    categories: []
  });

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books, setCurrentPage]);

  async function fetchCategories() {
    try {
      const response = await axios.get("http://150.95.105.147:8080/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thể loại:", error);
    }
  }

  async function fetchBooks() {
    try {
      const data = await getAllBooks();
      console.log("Dữ liệu sách từ API:", data);
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      toast.error("❌ Lỗi khi lấy dữ liệu sách!");
      console.error("Lỗi khi lấy dữ liệu sách:", error);
    }
  }

  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowForm(true);
    setIsEditing(true);
  };

  const handleSave = async (book) => {
    try {
      // Đảm bảo categories là mảng số nguyên
      const bookToSave = {
        ...book,
        categories: Array.isArray(book.categories) 
          ? book.categories.map(cat => typeof cat === 'string' ? parseInt(cat, 10) : cat)
          : []
      };
      
      if (!isEditing) {
        await createBook(bookToSave);
        toast.success("📖 Thêm sách thành công!");
      } else {
        await updateBook(bookToSave.id, bookToSave);
        toast.info("✏️ Cập nhật sách thành công!");
      }
      fetchBooks();
      setShowForm(false);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
      console.error("Lỗi khi lưu sách:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      fetchBooks();
      toast.warning("🗑️ Xóa sách thành công!");
    } catch (error) {
      toast.error(`❌ ${error.message}`);
      console.error("Lỗi khi xóa sách:", error);
    }
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Hàm lấy tên thể loại
  const getCategoryNames = (categories) => {
    if (!categories || categories.length === 0) return "Chưa có thể loại";
    
    return categories.map(cat => {
      const category = typeof cat === 'object' ? cat : categories.find(c => c.id === cat);
      return category ? category.name : "";
    }).filter(Boolean).join(", ");
  };

  const handleCategoryChange = (e) => {
    // Chuyển đổi giá trị từ chuỗi sang số nguyên
    const selectedOptions = Array.from(
      e.target.selectedOptions, 
      option => parseInt(option.value, 10)
    );
    setFormData({ ...formData, categories: selectedOptions });
  };

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
      </div>

      <button
        className="add-button"
        onClick={() => {
          setSelectedBook(null);
          setShowForm(true);
          setIsEditing(false);
        }}
      >
        Thêm sách mới
      </button>

      <table className="container-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Hình ảnh</th>
            <th>Mô tả</th>
            <th>Thể loại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  {book.image ? (
                    <img 
                      src={book.image} 
                      alt={book.title} 
                      style={{ width: '50px', height: '70px', objectFit: 'cover' }} 
                    />
                  ) : (
                    "Không có ảnh"
                  )}
                </td>
                <td>
                  {book.description ? (
                    book.description.length > 50 
                      ? `${book.description.substring(0, 50)}...` 
                      : book.description
                  ) : (
                    "Không có mô tả"
                  )}
                </td>
                <td>
                  {getCategoryNames(book.categories)}
                </td>
                <td className="button-group">
                  <button className="edit-button" onClick={() => handleEdit(book)}>
                    Sửa
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(book.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
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
>>>>>>> Stashed changes

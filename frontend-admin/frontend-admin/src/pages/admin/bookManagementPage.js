import { useState, useEffect } from "react";
import axios from "axios";
import BookForm from "../../component/Book/BookForm";
import BookTable from "../../component/Book/BookTable";
import Pagination from "../../component/common/Pagination";

const BookManagementPage = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    id: "",
    title: "",
    author: "",
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 4;

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("https://api.it-ebook.io.vn/api/books");
      setBooks(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sách:", error);
    }
  };

  const handleSubmit = async (bookData) => {
    try {
      // Đảm bảo dữ liệu đầy đủ trước khi gửi đi
      const dataToSend = { ...bookData };
      
      // Đảm bảo có trường categories nếu chưa có
      if (!dataToSend.categories && dataToSend.category) {
        if (typeof dataToSend.category === 'string') {
          dataToSend.categories = [{ name: dataToSend.category }];
        }
      }
      
      if (isEditing) {
        await axios.put(`https://api.it-ebook.io.vn/api/books/${dataToSend.id}`, dataToSend);
      } else {
        const response = await axios.post("https://api.it-ebook.io.vn/api/books", dataToSend);
        setBooks((prevBooks) => [...prevBooks, response.data]); 
      }
  
      setShowForm(false);
      setIsEditing(false);
      setForm({ id: "", title: "", author: "", image: "" });
  
      fetchBooks();
    } catch (error) {
      console.error("Lỗi khi lưu sách:", error);
    }
  };
  
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);
  

  return (
    <div className="container">
      <div className="container-management">
        <h2>Quản lý Sách</h2>

        {showForm && (
          <BookForm
            book={form}
            onSave={handleSubmit}
            setShowForm={setShowForm}
            isEditing={isEditing}
          />
        )}
        <BookTable
          books={currentBooks}
          currentPage={currentPage}
          booksPerPage={booksPerPage}
          setCurrentPage={setCurrentPage}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default BookManagementPage;

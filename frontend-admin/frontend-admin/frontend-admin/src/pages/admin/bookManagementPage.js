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
      const response = await axios.get("http://150.95.105.147:8080/api/books");
      setBooks(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sách:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `http://150.95.105.147:8080/api/books/${form.id}`,
          form
        );
      } else {
        await axios.post("http://150.95.105.147:8080/api/books", {
          ...form
        });
      }
      await fetchBooks();
      setShowForm(false);
      setIsEditing(false);
      setForm({ id: "", title: "", author: ""});
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
            form={form}
            handleInputChange={(e) =>
              setForm({ ...form, [e.target.name]: e.target.value })
            }
            handleSubmit={handleSubmit}
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

import { useState, useEffect } from "react";
import BookForm from "../../component/Book/BookForm";
import BookTable from "../../component/Book/BookTable";
import Pagination from "../../component/common/Pagination";
import bookService from "../../service/bookService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const booksPerPage = 4;

  // Calculate pagination values
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Adjust current page when books length changes
  useEffect(() => {
    const maxPage = Math.ceil(books.length / booksPerPage);
    if (currentPage > maxPage) {
      setCurrentPage(Math.max(1, maxPage));
    }
  }, [books.length, currentPage]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      const formattedData = Array.isArray(data) ? data : [];
      setBooks(formattedData);
      setError(null);
    } catch (error) {
      setError("Unable to load books. Please try again later.");
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setForm(book);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await bookService.deleteBook(id);
      // Update local state by removing the deleted book
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      toast.error(
        "Unable to delete book: " + (error.message || "Unknown error")
      );
    }
  };
  

  const handleSubmit = async (bookData) => {
    try {
      const dataToSend = { ...bookData };

      if (!dataToSend.categories && dataToSend.category) {
        if (typeof dataToSend.category === "string") {
          dataToSend.categories = [{ name: dataToSend.category }];
        }
      }

      let updatedBook;
      if (isEditing) {
        updatedBook = await bookService.updateBook(dataToSend.id, dataToSend);
        // Update the book in the local state
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === updatedBook.id ? updatedBook : book
          )
        );
      } else {
        updatedBook = await bookService.createBook(dataToSend);
        // Add the new book to the local state
        setBooks((prevBooks) => [...prevBooks, updatedBook]);
        // Calculate new total pages and set to last page
        const newTotalPages = Math.ceil((books.length + 1) / booksPerPage);
        setCurrentPage(newTotalPages);
      }

      setShowForm(false);
      setIsEditing(false);
      setForm({ id: "", title: "", author: "", image: "" });
    } catch (error) {
      toast.error("Error saving book: " + (error.message || "Unknown error"));
    }
  };

  if (loading && books.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-management">
        <h2>Book Management</h2>

        {error && <div className="error-message">{error}</div>}

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
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          booksPerPage={booksPerPage}
          setCurrentPage={setCurrentPage}
          loading={loading}
        />
        {books.length > booksPerPage && (
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

export default BookManagementPage;

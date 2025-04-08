import React, { useEffect, useState } from "react";
import axios from "axios";
import BookForm from "./BookForm";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookTable = ({ currentPage, booksPerPage, setCurrentPage }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hàm chuyển đổi có dấu thành không dấu
  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    const filtered = books.filter((book) => {
      const searchLower = removeAccents(searchTerm.toLowerCase());
  
      const titleMatch = book.title
        ? removeAccents(book.title.toLowerCase()).includes(searchLower)
        : false;
  
      const authorMatch = book.author
        ? removeAccents(book.author.toLowerCase()).includes(searchLower)
        : false;
  
      let categoriesMatch = false;
      if (book.categories && Array.isArray(book.categories)) {
        categoriesMatch = book.categories.some(
          (cat) =>
            cat?.name &&
            removeAccents(cat.name.toLowerCase()).includes(searchLower)
        );
      } else if (Array.isArray(book.category)) {
        categoriesMatch = book.category.some(
          (cat) =>
            cat?.name &&
            removeAccents(cat.name.toLowerCase()).includes(searchLower)
        );
      } else if (typeof book.category === "string") {
        categoriesMatch = removeAccents(book.category.toLowerCase()).includes(
          searchLower
        );
      }
  
      return titleMatch || authorMatch || categoriesMatch;
    });
    setFilteredBooks(filtered);
  }, [searchTerm, books, setCurrentPage]);
  

  async function fetchBooks() {
    try {
      const response = await axios.get("https://api.it-ebook.io.vn/api/books");
      setBooks(response.data);
    } catch (error) {
      toast.error("❌ Error fetching books!");
    }
  }

  const handleEdit = (book) => {
    setSelectedBook(book);
    setShowForm(true);
    setIsEditing(true);
  };

  const handleSave = async (book) => {
    try {
      let response;
      if (!isEditing) {
        // Create new book
        const bookData = {
          title: book.title,
          author: book.author,
          categories: book.categories || [],
          category: book.category || "",
          image: book.image || "",
          createdAt: new Date().toISOString(),
        };

        console.log("Sending book data:", bookData);
        response = await axios.post(
          "https://api.it-ebook.io.vn/api/books",
          bookData
        );
      } else {
        // Update existing book
        const bookData = {
          title: book.title,
          author: book.author,
          categories: book.categories || [],
          // category: book.category || "",
          image: book.image || "",
        };
        console.log("Sending book dataa:", bookData);

        console.log("Updating book data:", bookData);
        response = await axios.put(
          `https://api.it-ebook.io.vn/api/books/${book.id}`,
          bookData
        );
      }

      // Refresh the book list
      fetchBooks();

      // Return the saved book data
      return response.data;
    } catch (error) {
      console.error("Error saving book:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        toast.error(`❌ Error saving book: ${error.response.data}`);
      } else {
        toast.error("❌ Error saving book!");
      }
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.it-ebook.io.vn/api/books/${id}`);
      fetchBooks();
      toast.warning("🗑️ Book deleted successfully!");
    } catch (error) {
      toast.error("❌ Error deleting book!");
    }
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  return (
    <div>
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
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn-add"
          onClick={() => {
            setSelectedBook(null);
            setShowForm(true);
            setIsEditing(false);
          }}
        >
          Add New Book
        </button>
      </div>

      <table className="container-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cover Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Categories</th>
            <th>Created At</th>
            <th>Actions</th>
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
                      style={{
                        width: "50px",
                        height: "75px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">No image</div>
                  )}
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  {book.categories && Array.isArray(book.categories)
                    ? book.categories.map((cat) => cat.name).join(", ")
                    : Array.isArray(book.category)
                    ? book.category.map((cat) => cat.name).join(", ")
                    : book.category || ""}
                </td>
                <td>{formatDate(book.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(book)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                {searchTerm ? "No matching books found" : "No books yet"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
